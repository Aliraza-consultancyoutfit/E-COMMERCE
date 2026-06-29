"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Link as MuiLink,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  ArrowIcon,
  ShieldIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@/assets/icons/common";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import ProductCard from "@/ui/storefront/product-card";
import HeartIcon from "@/ui/storefront/product-card/heart-icon";
import { useWishlistToggle } from "@/ui/storefront/product-card/use-wishlist-toggle";
import QuantityStepper from "@/ui/storefront/quantity-stepper";
import {
  CategoryGlyph,
  categoryGradient,
} from "@/ui/storefront/category-visuals";
import { PATHS } from "@/constants/routes";
import {
  useGetProductQuery,
  useGetProductsQuery,
} from "@/store/products/products.api";
import { useAddToCart } from "@/ui/storefront/use-add-to-cart";
import { formatCurrency } from "@/utils/format";

const TABS = ["Description", "Specifications", "Reviews"] as const;

const FEATURES = [
  { label: "Free shipping", Icon: ShoppingCartIcon },
  { label: "30-day returns", Icon: ArrowIcon },
  { label: "2-year warranty", Icon: ShieldIcon },
];

export default function ProductDetail({ id }: { id: string }) {
  const router = useRouter();
  const { add, isLoading: isAdding } = useAddToCart();
  const { toggle, isWishlisted, isBusy: isWishlistBusy } = useWishlistToggle();
  const { data: product, isLoading, isError, refetch } =
    useGetProductQuery(id);

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);

  const { data: relatedData } = useGetProductsQuery(
    { category: product?.category, limit: 5 },
    { skip: !product },
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "grid",
            gap: 5,
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          }}
        >
          <Skeleton variant="rounded" sx={{ aspectRatio: "1 / 1", borderRadius: 5 }} />
          <Stack spacing={2}>
            <Skeleton width="40%" height={28} />
            <Skeleton width="80%" height={48} />
            <Skeleton width="30%" height={40} />
            <Skeleton variant="rounded" height={120} />
            <Skeleton variant="rounded" width={200} height={52} />
          </Stack>
        </Box>
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {isError ? (
          <ApiErrorState
            height="50vh"
            buttonText="Try again"
            buttonClick={() => refetch()}
          />
        ) : (
          <NoData
            height="50vh"
            message="Product not found"
            description="This product may have been removed. Browse the catalog for more."
            buttonText="Back to catalog"
            buttonClick={() => router.push(PATHS.catalog)}
          />
        )}
      </Container>
    );
  }

  const hasDiscount = product.oldPrice > product.price;
  const savePercent = hasDiscount
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const inStock = product.stock > 0;
  const wishlisted = isWishlisted(product._id);
  const related = (relatedData?.records ?? [])
    .filter((item) => item._id !== product._id)
    .slice(0, 4);

  const handleAddToCart = () => add(product._id, qty);
  const handleBuyNow = async () => {
    const added = await add(product._id, qty);
    if (added) {
      router.push(PATHS.cart);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Breadcrumbs sx={{ mb: 2.5 }}>
        <MuiLink component={NextLink} href={PATHS.home} color="text.secondary" underline="hover">
          Home
        </MuiLink>
        <MuiLink
          component={NextLink}
          href={`${PATHS.catalog}?category=${encodeURIComponent(product.category)}`}
          color="text.secondary"
          underline="hover"
        >
          {product.category}
        </MuiLink>
        <Typography color="text.primary" fontWeight={600}>
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "grid",
          gap: 5,
          alignItems: "start",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          mb: 5,
        }}
      >
        {/* Gallery */}
        <Box>
          <Box
            sx={{
              position: "relative",
              aspectRatio: "1 / 1",
              borderRadius: 5,
              mb: 1.75,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              color: (theme) => alpha(theme.palette.text.primary, 0.25),
              background: (theme) => categoryGradient(theme, product.category),
            }}
          >
            {product.image ? (
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <CategoryGlyph category={product.category} size={120} />
            )}
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5 }}>
            {[0, 1, 2, 3].map((index) => (
              <Box
                key={index}
                sx={{
                  aspectRatio: "1 / 1",
                  borderRadius: 3,
                  cursor: "pointer",
                  border: 2,
                  borderColor: index === 0 ? "primary.main" : "transparent",
                  background: (theme) => categoryGradient(theme, product.category),
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Info */}
        <Box>
          <Chip
            label={product.category}
            size="small"
            sx={{
              mb: 1.75,
              fontWeight: 600,
              color: "primary.main",
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            }}
          />
          <Typography variant="h3" fontWeight={700} sx={{ letterSpacing: "-0.015em", mb: 1.5 }}>
            {product.name}
          </Typography>

          <Stack direction="row" spacing={1.25} alignItems="center" sx={{ mb: 2.25 }}>
            <Stack direction="row" spacing={0.25}>
              {[0, 1, 2, 3, 4].map((i) => (
                <StarIcon key={i} width="18" height="18" />
              ))}
            </Stack>
            <Typography variant="body2" fontWeight={600}>
              {product.rating}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              · {product.reviews} reviews
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h4" fontWeight={700}>
              {formatCurrency(product.price)}
            </Typography>
            {hasDiscount && (
              <>
                <Typography
                  color="text.secondary"
                  sx={{ textDecoration: "line-through", fontSize: 18 }}
                >
                  {formatCurrency(product.oldPrice)}
                </Typography>
                <Chip
                  label={`Save ${savePercent}%`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    color: "error.main",
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.12),
                  }}
                />
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: inStock ? "success.main" : "error.main",
              }}
            />
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ color: inStock ? "success.main" : "error.main" }}
            >
              {inStock ? "In stock · ships within 24h" : "Out of stock"}
            </Typography>
          </Stack>

          <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 3.5 }}>
            {product.description}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
            <QuantityStepper
              value={qty}
              min={1}
              max={Math.max(1, product.stock)}
              onChange={setQty}
            />
            {inStock && product.stock <= 5 && (
              <Typography variant="body2" color="text.secondary">
                Only {product.stock} left
              </Typography>
            )}
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 3 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!inStock || isAdding}
              startIcon={<ShoppingCartIcon width="19" height="19" stroke="currentColor" />}
              onClick={handleAddToCart}
              sx={{ height: 52 }}
            >
              Add to cart
            </Button>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              disabled={!inStock || isAdding}
              onClick={handleBuyNow}
              sx={{ height: 52 }}
            >
              Buy now
            </Button>
            <Button
              variant="outlined"
              size="large"
              disabled={isWishlistBusy}
              aria-label={
                wishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              aria-pressed={wishlisted}
              onClick={() => toggle(product._id)}
              startIcon={<HeartIcon filled={wishlisted} width="19" height="19" />}
              sx={{
                height: 52,
                minWidth: 52,
                flexShrink: 0,
                color: wishlisted ? "error.main" : "text.primary",
                borderColor: wishlisted ? "error.main" : "divider",
                "& .MuiButton-startIcon": { mr: { xs: 1, sm: 0 } },
              }}
            >
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                {wishlisted ? "In wishlist" : "Wishlist"}
              </Box>
            </Button>
          </Stack>

          <Stack
            direction="row"
            spacing={3}
            flexWrap="wrap"
            useFlexGap
            sx={{ pt: 2.25, borderTop: 1, borderColor: "divider" }}
          >
            {FEATURES.map(({ label, Icon }) => (
              <Stack key={label} direction="row" spacing={0.875} alignItems="center">
                <Box sx={{ color: "text.secondary", display: "flex" }}>
                  <Icon width="16" height="16" stroke="currentColor" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Stack direction="row" spacing={3}>
          {TABS.map((label, index) => (
            <Box
              key={label}
              onClick={() => setTab(index)}
              sx={{
                py: 1.5,
                cursor: "pointer",
                fontWeight: 600,
                color: tab === index ? "primary.main" : "text.secondary",
                borderBottom: 2,
                borderColor: tab === index ? "primary.main" : "transparent",
                mb: "-1px",
              }}
            >
              {label}
            </Box>
          ))}
        </Stack>
      </Box>

      <Box sx={{ mb: 5, maxWidth: 760 }}>
        {tab === 0 && (
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {product.description}
          </Typography>
        )}
        {tab === 1 && (
          <Stack>
            {[
              ["Category", product.category],
              ["Price", formatCurrency(product.price)],
              ["Availability", inStock ? `${product.stock} in stock` : "Out of stock"],
              ["Rating", `${product.rating} / 5`],
              ["Reviews", `${product.reviews}`],
            ].map(([label, value], index, arr) => (
              <Stack
                key={label}
                direction="row"
                justifyContent="space-between"
                sx={{
                  py: 1.75,
                  borderBottom: index < arr.length - 1 ? 1 : 0,
                  borderColor: "divider",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        )}
        {tab === 2 && (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h4" fontWeight={700}>
                {product.rating}
              </Typography>
              <Stack direction="row" spacing={0.25}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <StarIcon key={i} width="16" height="16" />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Based on {product.reviews} verified reviews
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Individual customer reviews aren&apos;t available in this demo.
            </Typography>
          </Stack>
        )}
      </Box>

      {/* Related */}
      {related.length > 0 && (
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 2.5 }}>
            You might also like
          </Typography>
          <Box
            sx={{
              display: "grid",
              gap: 2.5,
              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
            }}
          >
            {related.map((item) => (
              <ProductCard
                key={item._id}
                product={item}
                onOpen={() => router.push(PATHS.product(item._id))}
                onQuickAdd={() => add(item._id, 1)}
              />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}
