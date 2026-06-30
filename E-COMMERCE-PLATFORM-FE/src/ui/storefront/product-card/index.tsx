"use client";

import { MouseEvent } from "react";
import { Box, Card, Chip, IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PlusIcon, StarIcon } from "@/assets/icons/common";
import { CategoryGlyph, categoryGradient } from "@/ui/storefront/category-visuals";
import HeartIcon from "@/ui/storefront/product-card/heart-icon";
import { useWishlistToggle } from "@/ui/storefront/product-card/use-wishlist-toggle";
import { formatCurrency } from "@/utils/format";
import type { Product } from "@/store/products/products.types";

interface ProductCardProps {
  product: Product;
  onOpen?: () => void;
  onQuickAdd?: () => void;
  showStockBadge?: boolean;
  /** Hide the wishlist heart (e.g. inside the wishlist panel itself). */
  hideWishlist?: boolean;
}

export default function ProductCard({
  product,
  onOpen,
  onQuickAdd,
  showStockBadge = false,
  hideWishlist = false,
}: ProductCardProps) {
  const { toggle, isWishlisted, isBusy } = useWishlistToggle();
  const hasDiscount = product.oldPrice > product.price;
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const wishlisted = isWishlisted(product._id);

  const handleQuickAdd = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onQuickAdd?.();
  };

  const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    toggle(product._id);
  };

  return (
    <Card
      variant="outlined"
      onClick={onOpen}
      sx={{
        borderRadius: 4,
        overflow: "hidden",
        cursor: onOpen ? "pointer" : "default",
        transition: "box-shadow .2s, border-color .2s",
        "&:hover": { boxShadow: 6, borderColor: "primary.light" },
      }}
    >
      <Box
        sx={{
          position: "relative",
          aspectRatio: "1 / 1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: (theme) => categoryGradient(theme, product.category),
        }}
      >
        <Chip
          label={product.category}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            fontWeight: 600,
            bgcolor: "background.paper",
            color: "primary.main",
          }}
        />
        {!hideWishlist && (
          <IconButton
            onClick={handleWishlist}
            disabled={isBusy}
            aria-label={
              wishlisted
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={wishlisted}
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "background.paper",
              color: wishlisted ? "error.main" : "text.secondary",
              "&:hover": {
                bgcolor: "background.paper",
                color: "error.main",
              },
            }}
          >
            <HeartIcon filled={wishlisted} width="18" height="18" />
          </IconButton>
        )}
        {showStockBadge && (outOfStock || lowStock) && (
          <Chip
            label={outOfStock ? "Out of stock" : "Low stock"}
            size="small"
            color={outOfStock ? "default" : "warning"}
            sx={{ position: "absolute", bottom: 10, left: 10, fontWeight: 600 }}
          />
        )}
        {product.image ? (
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ color: (theme) => alpha(theme.palette.text.primary, 0.25) }}>
            <CategoryGlyph category={product.category} size={56} />
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography fontWeight={600} noWrap title={product.name}>
          {product.name}
        </Typography>

        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ my: 0.75 }}>
          <StarIcon width="14" height="14" />
          <Typography variant="body2" fontWeight={600}>
            {product.rating}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ({product.reviews})
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="baseline">
            <Typography variant="h6" fontWeight={700}>
              {formatCurrency(product.price)}
            </Typography>
            {hasDiscount && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "line-through" }}
              >
                {formatCurrency(product.oldPrice)}
              </Typography>
            )}
          </Stack>

          {onQuickAdd && (
            <IconButton
              onClick={handleQuickAdd}
              disabled={outOfStock}
              aria-label={`Add ${product.name} to cart`}
              sx={{
                borderRadius: 2,
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                "&:hover": { bgcolor: "primary.main", color: "primary.contrastText" },
              }}
            >
              <PlusIcon width="18" height="18" />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
