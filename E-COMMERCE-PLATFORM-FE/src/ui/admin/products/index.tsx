"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  InputBase,
  Pagination,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { CrossIcon, EditIcon, PlusIcon } from "@/assets/icons/common";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import { CategoryGlyph, categoryGradient } from "@/ui/storefront/category-visuals";
import { PATHS } from "@/constants/routes";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/store/products/products.api";
import type { Product } from "@/store/products/products.types";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format";

const PAGE_LIMIT = 8;

function StockChip({ stock }: { stock: number }) {
  if (stock === 0) {
    return <Chip size="small" label="Out of stock" color="default" sx={{ fontWeight: 600 }} />;
  }
  if (stock <= 5) {
    return <Chip size="small" label="Low stock" color="warning" sx={{ fontWeight: 600 }} />;
  }
  return <Chip size="small" label="Active" color="success" sx={{ fontWeight: 600 }} />;
}

export default function AdminProducts() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useGetProductsQuery({
    page,
    limit: PAGE_LIMIT,
    search: search.trim() || undefined,
  });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const records = data?.records ?? [];
  const meta = data?.meta;

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    try {
      await deleteProduct(deleteTarget._id).unwrap();
      toast.success("Product deleted");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Products
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {meta ? `${meta.total} products` : "Manage your catalog"}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5}>
          <InputBase
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products"
            inputProps={{ "aria-label": "Search products" }}
            sx={{ height: 42, px: 2, borderRadius: 2.5, border: 1, borderColor: "divider", bgcolor: "background.paper", minWidth: 200 }}
          />
          <Button
            variant="contained"
            startIcon={<PlusIcon width="18" height="18" />}
            onClick={() => router.push(PATHS.admin.productNew)}
            sx={{ flexShrink: 0 }}
          >
            Add product
          </Button>
        </Stack>
      </Stack>

      {isLoading ? (
        <Skeleton variant="rounded" height={420} />
      ) : isError ? (
        <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />
      ) : records.length === 0 ? (
        <NoData
          height="40vh"
          message="No products found"
          description="Add your first product to get started."
          buttonText="Add product"
          buttonClick={() => router.push(PATHS.admin.productNew)}
        />
      ) : (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden", opacity: isFetching ? 0.6 : 1 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((product) => (
                  <TableRow key={product._id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: (t) => alpha(t.palette.text.primary, 0.3),
                            background: (t) => categoryGradient(t, product.category),
                          }}
                        >
                          <CategoryGlyph category={product.category} size={20} />
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {product.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{product.category}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(product.price)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{product.stock}</TableCell>
                    <TableCell><StockChip stock={product.stock} /></TableCell>
                    <TableCell align="right">
                      <IconButton aria-label="Edit" onClick={() => router.push(PATHS.admin.product(product._id))} sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}>
                        <EditIcon width="18" height="18" />
                      </IconButton>
                      <IconButton aria-label="Delete" onClick={() => setDeleteTarget(product)} sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                        <CrossIcon width="18" height="18" stroke="currentColor" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          {meta && meta.pages > 1 && (
            <Stack alignItems="center" sx={{ py: 2, borderTop: 1, borderColor: "divider" }}>
              <Pagination count={meta.pages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
            </Stack>
          )}
        </Box>
      )}

      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: 400 } }}>
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ width: 46, height: 46, borderRadius: 3, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "error.main", bgcolor: (t) => alpha(t.palette.error.main, 0.12) }}>
            <CrossIcon width="22" height="22" stroke="currentColor" />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Delete product?
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>
            &ldquo;{deleteTarget?.name}&rdquo; will be permanently removed. This can&apos;t be undone.
          </Typography>
          <Stack direction="row" spacing={1.25} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" disabled={deleting} onClick={confirmDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
}
