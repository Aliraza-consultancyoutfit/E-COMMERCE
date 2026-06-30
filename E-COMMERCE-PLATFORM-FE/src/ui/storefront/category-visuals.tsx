"use client";

import { Box } from "@mui/material";
import { alpha, useTheme, type PaletteColor, type Theme } from "@mui/material/styles";

type PaletteKey =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

/** SVG paths lifted from the Figma category icons (stroke, 24x24 viewBox). */
const CATEGORY_PATHS: Record<string, string[]> = {
  Audio: [
    "M3 18v-6a9 9 0 0 1 18 0v6",
    "M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z",
    "M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  ],
  Computers: ["M2 3h20v14H2z", "M8 21h8M12 17v4"],
  Wearables: ["M9 2h6l-1 5h-4zM9 22h6l-1-5h-4z", "M6 7h12v10H6z"],
  Home: ["m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  Gaming: [
    "M6 12h4m-2-2v4",
    "M15 13h.01M18 11h.01",
    "M17.3 5H6.7A4.7 4.7 0 0 0 2 9.7L2.6 16a3 3 0 0 0 5.2 1.6l.6-.6h7.2l.6.6A3 3 0 0 0 21.4 16l.6-6.3A4.7 4.7 0 0 0 17.3 5z",
  ],
  Cameras: [
    "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",
    "M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  ],
};

const FALLBACK_PATHS = [
  "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5",
  "M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17",
];

const CATEGORY_COLOR: Record<string, PaletteKey> = {
  Audio: "primary",
  Computers: "success",
  Wearables: "warning",
  Gaming: "secondary",
  Home: "error",
  Cameras: "info",
};

const colorKey = (category: string): PaletteKey =>
  CATEGORY_COLOR[category] ?? "primary";

const mainColor = (theme: Theme, category: string): string =>
  (theme.palette[colorKey(category)] as PaletteColor).main;

/** Decorative gradient used for product image tiles (matches the Figma look). */
export const categoryGradient = (theme: Theme, category: string): string => {
  const main = mainColor(theme, category);
  return `linear-gradient(135deg, ${alpha(main, 0.3)}, ${alpha(main, 0.08)})`;
};

interface CategoryGlyphProps {
  category: string;
  size?: number;
}

export function CategoryGlyph({ category, size = 24 }: CategoryGlyphProps) {
  const paths = CATEGORY_PATHS[category] ?? FALLBACK_PATHS;
  return (
    <Box
      component="svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      sx={{ display: "block" }}
    >
      {paths.map((d, index) => (
        <path key={index} d={d} />
      ))}
    </Box>
  );
}

interface CategoryAvatarProps {
  category: string;
  size?: number;
  iconSize?: number;
}

/** Tinted rounded tile with the category's icon, colored per category. */
export function CategoryAvatar({
  category,
  size = 48,
  iconSize = 24,
}: CategoryAvatarProps) {
  const theme = useTheme();
  const main = mainColor(theme, category);
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: main,
        bgcolor: alpha(main, 0.12),
      }}
    >
      <CategoryGlyph category={category} size={iconSize} />
    </Box>
  );
}
