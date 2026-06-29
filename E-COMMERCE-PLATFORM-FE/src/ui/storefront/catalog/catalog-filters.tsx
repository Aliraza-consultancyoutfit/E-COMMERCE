"use client";

import {
  Box,
  Divider,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { formatCurrency } from "@/utils/format";
import type { ProductCategory } from "@/store/products/products.types";

interface CatalogFiltersProps {
  categories: ProductCategory[];
  activeCategory?: string;
  onCategoryChange: (category?: string) => void;
  priceMax: number;
  onPriceMaxChange: (value: number) => void;
  onClear: () => void;
}

export const PRICE_CEILING = 1000;

export default function CatalogFilters({
  categories,
  activeCategory,
  onCategoryChange,
  priceMax,
  onPriceMaxChange,
  onClear,
}: CatalogFiltersProps) {
  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.5 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography fontWeight={700}>Filters</Typography>
        <Typography
          variant="body2"
          color="primary.main"
          fontWeight={600}
          sx={{ cursor: "pointer" }}
          onClick={onClear}
        >
          Clear all
        </Typography>
      </Stack>

      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Category
      </Typography>
      <Stack spacing={0.5} sx={{ mb: 2.5 }}>
        {categories.map((entry) => {
          const isActive = entry.category === activeCategory;
          return (
            <Stack
              key={entry.category}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              onClick={() =>
                onCategoryChange(isActive ? undefined : entry.category)
              }
              sx={{
                px: 1.25,
                py: 0.75,
                borderRadius: 2,
                cursor: "pointer",
                color: isActive ? "primary.main" : "text.primary",
                bgcolor: isActive
                  ? (theme) => alpha(theme.palette.primary.main, 0.1)
                  : "transparent",
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
                {entry.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {entry.count}
              </Typography>
            </Stack>
          );
        })}
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
        Price range
      </Typography>
      <Slider
        value={priceMax}
        min={0}
        max={PRICE_CEILING}
        step={10}
        onChange={(_, value) => onPriceMaxChange(value as number)}
        aria-label="Maximum price"
      />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {formatCurrency(0)}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {priceMax >= PRICE_CEILING
            ? `${formatCurrency(PRICE_CEILING)}+`
            : formatCurrency(priceMax)}
        </Typography>
      </Stack>
    </Box>
  );
}
