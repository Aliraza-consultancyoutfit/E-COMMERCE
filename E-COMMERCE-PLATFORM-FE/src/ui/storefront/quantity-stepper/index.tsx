"use client";

import { Box, IconButton } from "@mui/material";
import { MinusIcon, PlusIcon } from "@/assets/icons/common";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export default function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
}: QuantityStepperProps) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <IconButton
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        sx={{ borderRadius: 0, color: "text.primary" }}
      >
        <MinusIcon width="16" height="16" />
      </IconButton>
      <Box
        sx={{
          minWidth: 44,
          textAlign: "center",
          fontWeight: 600,
          fontSize: 16,
          borderLeft: 1,
          borderRight: 1,
          borderColor: "divider",
          alignSelf: "stretch",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value}
      </Box>
      <IconButton
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        sx={{ borderRadius: 0, color: "text.primary" }}
      >
        <PlusIcon width="16" height="16" />
      </IconButton>
    </Box>
  );
}
