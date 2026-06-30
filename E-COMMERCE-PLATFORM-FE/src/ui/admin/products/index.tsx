"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
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
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/store/products/products.api";
import type { Product } from "@/store/products/products.types";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format";

const PAGE_LIMIT = 8;

/** Stable pseudo-SKU shown under the product name (we don't store a real SKU). */
const skuOf = (product: Product) =>
  `${product.category.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase() || "SKU"}-${product._id
    .slice(-5)
    .toUpperCase()}`;

function StatusPill({ stock }: { stock: number }) {
  const meta =
    stock === 0
      ? { label: "Out of stock", color: "error" as const }
      : stock <= 10
        ? { label: "Low stock", color: "warning" as const }
        : { label: "Active", color: "success" as const };
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 1.4,
        py: 0.45,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        color: `${meta.color}.main`,
        bgcolor: (t) => alpha(t.palette[meta.color].main, 0.14),
      }}
    >
      {meta.label}
    </Box>
  );
}

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.85} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 3H2l8 9.5V19l4 2v-8.5z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const DotsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.6" />
    <circle cx="12" cy="12" r="1.6" />
    <circle cx="12" cy="19" r="1.6" />
  </svg>
);

export default function AdminProducts() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [menu, setMenu] = useState<{ anchor: HTMLElement; product: Product } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useGetProductsQuery({
    page,
    limit: PAGE_LIMIT,
    search: search.trim() || undefined,
  });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();
  const [createProduct] = useCreateProductMutation();

  const records = data?.records ?? [];
  const meta = data?.meta;

  const selectedIds = useMemo(() => Object.keys(selected).filter((id) => selected[id]), [selected]);
  const allChecked = records.length > 0 && records.every((p) => selected[p._id]);
  const someChecked = records.some((p) => selected[p._id]);

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) => {
      const next = { ...prev };
      if (allChecked) records.forEach((p) => delete next[p._id]);
      else records.forEach((p) => (next[p._id] = true));
      return next;
    });

  const confirmSingleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget._id).unwrap();
      toast.success("Product deleted");
      setSelected((prev) => {
        const next = { ...prev };
        delete next[deleteTarget._id];
        return next;
      });
      setDeleteTarget(null);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await Promise.all(selectedIds.map((id) => deleteProduct(id).unwrap()));
      toast.success(`${selectedIds.length} products deleted`);
      setSelected({});
      setBulkDeleteOpen(false);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleDuplicate = async (product: Product) => {
    setMenu(null);
    const { _id, ...rest } = product;
    void _id;
    try {
      await createProduct({ ...rest, name: `${product.name} (Copy)` }).unwrap();
      toast.success("Product duplicated");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Box>
      {/* Toolbar */}
      <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ sm: "center" }} spacing={1.5} sx={{ mb: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ flex: 1, maxWidth: 300, height: 40, px: 1.75, borderRadius: 2.5, border: 1, borderColor: "divider", bgcolor: "background.paper", color: "text.secondary" }}
        >
          <SearchIcon />
          <InputBase
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search products"
            inputProps={{ "aria-label": "Search products" }}
            sx={{ flex: 1, fontSize: 14, color: "text.primary" }}
          />
        </Stack>
        <Button variant="outlined" color="inherit" startIcon={<FilterIcon />} sx={{ borderColor: "divider", color: "text.primary" }}>
          Filters
        </Button>
        <Button
          variant="contained"
          startIcon={<PlusIcon width="18" height="18" />}
          onClick={() => router.push(PATHS.admin.productNew)}
          sx={{ ml: { sm: "auto" }, flexShrink: 0 }}
        >
          Add product
        </Button>
      </Stack>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.75}
          sx={{ mb: 1.75, px: 2.25, py: 1.5, borderRadius: 3, border: 1, borderColor: "primary.light", bgcolor: (t) => alpha(t.palette.primary.main, 0.1) }}
        >
          <Typography variant="body2" fontWeight={600} color="primary.main">
            {selectedIds.length} selected
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="small"
            sx={{ ml: "auto" }}
            onClick={() => setBulkDeleteOpen(true)}
          >
            Delete
          </Button>
        </Stack>
      )}

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
                  <TableCell padding="checkbox" sx={{ pl: 2 }}>
                    <Checkbox
                      checked={allChecked}
                      indeterminate={someChecked && !allChecked}
                      onChange={toggleAll}
                      inputProps={{ "aria-label": "Select all products" }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Stock</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((product) => {
                  const checked = Boolean(selected[product._id]);
                  return (
                    <TableRow
                      key={product._id}
                      hover
                      selected={checked}
                      sx={{ "&.Mui-selected": { bgcolor: (t) => alpha(t.palette.primary.main, 0.07) } }}
                    >
                      <TableCell padding="checkbox" sx={{ pl: 2 }}>
                        <Checkbox
                          checked={checked}
                          onChange={() => toggleOne(product._id)}
                          inputProps={{ "aria-label": `Select ${product.name}` }}
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          {product.image ? (
                            <Box
                              component="img"
                              src={product.image}
                              alt={product.name}
                              sx={{ width: 40, height: 40, borderRadius: 2, flexShrink: 0, objectFit: "cover" }}
                            />
                          ) : (
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
                          )}
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {skuOf(product)}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{product.category}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(product.price)}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>{product.stock}</TableCell>
                      <TableCell><StatusPill stock={product.stock} /></TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label={`Actions for ${product.name}`}
                          onClick={(e) => setMenu({ anchor: e.currentTarget, product })}
                          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
                        >
                          <DotsIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
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

      {/* Row action menu */}
      <Menu
        anchorEl={menu?.anchor}
        open={Boolean(menu)}
        onClose={() => setMenu(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 168, mt: 0.5 } } }}
      >
        <MenuItem
          onClick={() => {
            if (menu) router.push(PATHS.admin.product(menu.product._id));
            setMenu(null);
          }}
          sx={{ gap: 1.25, fontSize: 14 }}
        >
          <EditIcon width="16" height="16" /> Edit
        </MenuItem>
        <MenuItem onClick={() => menu && handleDuplicate(menu.product)} sx={{ gap: 1.25, fontSize: 14 }}>
          <PlusIcon width="16" height="16" /> Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menu) setDeleteTarget(menu.product);
            setMenu(null);
          }}
          sx={{ gap: 1.25, fontSize: 14, color: "error.main" }}
        >
          <CrossIcon width="16" height="16" stroke="currentColor" /> Delete
        </MenuItem>
      </Menu>

      {/* Single delete dialog */}
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
            <Button variant="outlined" color="inherit" sx={{ borderColor: "divider" }} onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" disabled={deleting} onClick={confirmSingleDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </Stack>
        </Box>
      </Dialog>

      {/* Bulk delete dialog */}
      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: 400 } }}>
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ width: 46, height: 46, borderRadius: 3, mb: 2, display: "flex", alignItems: "center", justifyContent: "center", color: "error.main", bgcolor: (t) => alpha(t.palette.error.main, 0.12) }}>
            <CrossIcon width="22" height="22" stroke="currentColor" />
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Delete {selectedIds.length} products?
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>
            The selected products will be permanently removed. This can&apos;t be undone.
          </Typography>
          <Stack direction="row" spacing={1.25} justifyContent="flex-end">
            <Button variant="outlined" color="inherit" sx={{ borderColor: "divider" }} onClick={() => setBulkDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="error" disabled={deleting} onClick={confirmBulkDelete}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
}
