"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Box, Button, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import { ShoppingCartIcon } from "@/assets/icons/common";
import HeartIcon from "@/ui/storefront/product-card/heart-icon";
import { useAddToCart } from "@/ui/storefront/use-add-to-cart";
import { CategoryGlyph, categoryGradient } from "@/ui/storefront/category-visuals";
import { PATHS } from "@/constants/routes";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/wishlist/wishlist.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format";

export default function WishlistPanel() {
  const router = useRouter();
  const { data: wishlist, isLoading, isError, refetch } = useGetWishlistQuery();
  const [removeFromWishlist, { isLoading: removing }] =
    useRemoveFromWishlistMutation();
  const { add } = useAddToCart();

  const handleRemove = async (productId: string) => {
    try {
      await removeFromWishlist(productId).unwrap();
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const Header = (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" fontWeight={700}>
        Wishlist
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
        Items you saved for later.
      </Typography>
    </Box>
  );

  if (isLoading) {
    return (
      <Box>
        {Header}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
            gap: 2,
          }}
        >
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} variant="rounded" height={300} />
          ))}
        </Box>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        {Header}
        <ApiErrorState
          height="40vh"
          buttonText="Try again"
          buttonClick={() => refetch()}
        />
      </Box>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <Box>
        {Header}
        <NoData
          height="40vh"
          message="Your wishlist is empty"
          description="Tap the heart on any product to save it here."
          buttonText="Browse products"
          buttonClick={() => router.push(PATHS.catalog)}
        />
      </Box>
    );
  }

  return (
    <Box>
      {Header}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        {wishlist.map((product) => {
          const outOfStock = product.stock === 0;
          return (
            <Box
              key={product._id}
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                onClick={() => router.push(PATHS.product(product._id))}
                sx={{
                  position: "relative",
                  aspectRatio: "1 / 1",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: (theme) => alpha(theme.palette.text.primary, 0.25),
                  background: (theme) =>
                    categoryGradient(theme, product.category),
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
                  <CategoryGlyph category={product.category} size={48} />
                )}
                <IconButton
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemove(product._id);
                  }}
                  disabled={removing}
                  aria-label={`Remove ${product.name} from wishlist`}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "background.paper",
                    color: "error.main",
                    "&:hover": { bgcolor: "background.paper" },
                  }}
                >
                  <HeartIcon filled width="18" height="18" />
                </IconButton>
              </Box>
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
                <Typography fontWeight={600} noWrap title={product.name}>
                  {product.name}
                </Typography>
                <Typography variant="h6" fontWeight={700} sx={{ my: 1 }}>
                  {formatCurrency(product.price)}
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={outOfStock}
                  startIcon={
                    <ShoppingCartIcon width="18" height="18" stroke="currentColor" />
                  }
                  onClick={() => add(product._id, 1)}
                  sx={{ mt: "auto" }}
                >
                  {outOfStock ? "Out of stock" : "Add to cart"}
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={() => router.push(PATHS.catalog)}>
          Continue shopping
        </Button>
      </Stack>
    </Box>
  );
}
