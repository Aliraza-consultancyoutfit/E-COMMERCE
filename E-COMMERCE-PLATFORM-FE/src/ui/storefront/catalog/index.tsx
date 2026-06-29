"use client";

import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Breadcrumbs,
  Container,
  Link as MuiLink,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import NoData from "@/components/no-data";
import ApiErrorState from "@/components/api-error-state";
import ProductCard from "@/ui/storefront/product-card";
import CatalogFilters, { PRICE_CEILING } from "./catalog-filters";
import { PATHS } from "@/constants/routes";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/store/products/products.api";
import type { ProductSort } from "@/store/products/products.types";

const PAGE_LIMIT = 9;

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Sort: Featured" },
  { value: "price_asc", label: "Price: Low to high" },
  { value: "price_desc", label: "Price: High to low" },
  { value: "top_rated", label: "Top rated" },
];

const gridSx = {
  display: "grid",
  gap: 2.5,
  gridTemplateColumns: {
    xs: "repeat(1, 1fr)",
    sm: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  },
};

export default function Catalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? undefined;

  const [category, setCategory] = useState<string | undefined>(undefined);
  const [priceMax, setPriceMax] = useState(PRICE_CEILING);
  const [sort, setSort] = useState<ProductSort>("newest");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search,
      category,
      sort,
      maxPrice: priceMax < PRICE_CEILING ? priceMax : undefined,
    }),
    [page, search, category, sort, priceMax],
  );

  const { data, isLoading, isError, isFetching, refetch } =
    useGetProductsQuery(queryParams);
  const { data: categories = [] } = useGetCategoriesQuery();

  const records = data?.records ?? [];
  const meta = data?.meta;

  const resetPage = () => setPage(1);
  const handleCategory = (next?: string) => {
    setCategory(next);
    resetPage();
  };
  const handlePriceMax = (value: number) => {
    setPriceMax(value);
    resetPage();
  };
  const handleSort = (event: SelectChangeEvent) => {
    setSort(event.target.value as ProductSort);
    resetPage();
  };
  const handleClear = () => {
    setCategory(undefined);
    setPriceMax(PRICE_CEILING);
    setSort("newest");
    resetPage();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink
          component={NextLink}
          href={PATHS.home}
          color="text.secondary"
          underline="hover"
        >
          Home
        </MuiLink>
        <Typography color="text.primary" fontWeight={600}>
          All products
        </Typography>
      </Breadcrumbs>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "flex-end" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            All products
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {meta
              ? `Showing ${records.length} of ${meta.total} products`
              : "Loading products…"}
          </Typography>
        </Box>
        <Select
          size="small"
          value={sort}
          onChange={handleSort}
          sx={{ minWidth: 200 }}
        >
          {SORT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          alignItems: "start",
          gridTemplateColumns: { xs: "1fr", md: "260px 1fr" },
        }}
      >
        <CatalogFilters
          categories={categories}
          activeCategory={category}
          onCategoryChange={handleCategory}
          priceMax={priceMax}
          onPriceMaxChange={handlePriceMax}
          onClear={handleClear}
        />

        <Box>
          {isLoading ? (
            <Box sx={gridSx}>
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  height={320}
                  sx={{ borderRadius: 4 }}
                />
              ))}
            </Box>
          ) : isError ? (
            <ApiErrorState
              height="50vh"
              buttonText="Try again"
              buttonClick={() => refetch()}
            />
          ) : records.length === 0 ? (
            <NoData
              height="50vh"
              message="No products found"
              description="We couldn't find anything matching your filters. Try widening your price range or clearing filters."
              buttonText="Clear filters"
              buttonClick={handleClear}
            />
          ) : (
            <>
              <Box sx={{ ...gridSx, opacity: isFetching ? 0.6 : 1 }}>
                {records.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    showStockBadge
                    onOpen={() => router.push(PATHS.product(product._id))}
                  />
                ))}
              </Box>
              {meta && meta.pages > 1 && (
                <Stack alignItems="center" sx={{ mt: 4 }}>
                  <Pagination
                    count={meta.pages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Stack>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
