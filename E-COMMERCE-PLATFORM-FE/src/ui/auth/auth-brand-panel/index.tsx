"use client";

import { useCallback, useEffect, useState } from "react";
import { Avatar, Box, Stack, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  ShieldIcon,
  ShoppingCartIcon,
  StarIcon,
} from "@/assets/icons/common";

const STARS = [0, 1, 2, 3, 4];
const REVIEW_ROTATE_MS = 5000;

interface Review {
  quote: string;
  name: string;
  title: string;
  initials: string;
}

const REVIEWS: Review[] = [
  {
    quote:
      "We migrated our entire storefront and admin onto one system. Cleaner, faster, and our team finally agrees on the components.",
    name: "Maya Reyes",
    title: "Head of Commerce, Vela Retail",
    initials: "MR",
  },
  {
    quote:
      "Checkout conversions jumped the week we switched. The cart just works, and order tracking cut our support tickets in half.",
    name: "Daniel Okafor",
    title: "Founder, Northbound Goods",
    initials: "DO",
  },
  {
    quote:
      "Managing inventory used to be three tools and a spreadsheet. Now it's one dashboard the whole team actually trusts.",
    name: "Priya Sharma",
    title: "Operations Lead, Lumen Living",
    initials: "PS",
  },
];

interface ReviewSliderProps {
  reviews: Review[];
}

function ReviewSlider({ reviews }: ReviewSliderProps) {
  const theme = useTheme();
  const white = theme.palette.common.white;
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback(
    (index: number) => setActiveIndex((index + reviews.length) % reviews.length),
    [reviews.length],
  );

  useEffect(() => {
    if (prefersReducedMotion || isPaused || reviews.length <= 1) return undefined;

    const timer = window.setInterval(
      () => setActiveIndex((prev) => (prev + 1) % reviews.length),
      REVIEW_ROTATE_MS,
    );
    return () => window.clearInterval(timer);
  }, [prefersReducedMotion, isPaused, reviews.length]);

  const transition = prefersReducedMotion
    ? "none"
    : `transform ${theme.transitions.duration.complex}ms ${theme.transitions.easing.easeInOut}`;

  return (
    <Box
      role="group"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      sx={{
        bgcolor: alpha(white, 0.12),
        border: `1px solid ${alpha(white, 0.18)}`,
        borderRadius: 4,
        p: 2.5,
        overflow: "hidden",
      }}
    >
      <Box sx={{ overflow: "hidden" }}>
        <Stack
          direction="row"
          sx={{
            width: `${reviews.length * 100}%`,
            transform: `translateX(-${activeIndex * (100 / reviews.length)}%)`,
            transition,
          }}
        >
          {reviews.map((review, index) => (
            <Box
              key={review.name}
              aria-hidden={index !== activeIndex}
              sx={{ width: `${100 / reviews.length}%`, flexShrink: 0 }}
            >
              <Stack direction="row" spacing={0.5} sx={{ mb: 1.25 }}>
                {STARS.map((star) => (
                  <StarIcon key={star} width="16" height="16" />
                ))}
              </Stack>
              <Typography
                color="inherit"
                sx={{ fontSize: 14, lineHeight: 1.5, mb: 1.75, opacity: 0.95 }}
              >
                &ldquo;{review.quote}&rdquo;
              </Typography>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: alpha(white, 0.22),
                    fontSize: 13,
                    fontWeight: 600,
                    color: white,
                  }}
                >
                  {review.initials}
                </Avatar>
                <Box>
                  <Typography color="inherit" sx={{ fontSize: 14, fontWeight: 600 }}>
                    {review.name}
                  </Typography>
                  <Typography color="inherit" sx={{ fontSize: 12, opacity: 0.8 }}>
                    {review.title}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>

      {reviews.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} aria-hidden>
          {reviews.map((review, index) => (
            <Box
              key={review.name}
              component="button"
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Show review ${index + 1}`}
              sx={{
                p: 0,
                border: "none",
                cursor: "pointer",
                height: 6,
                width: index === activeIndex ? 20 : 6,
                borderRadius: 3,
                bgcolor: alpha(white, index === activeIndex ? 0.9 : 0.4),
                transition: prefersReducedMotion
                  ? "none"
                  : `width ${theme.transitions.duration.shorter}ms, background-color ${theme.transitions.duration.shorter}ms`,
              }}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
}

/** Left marketing panel of the auth split layout. Hidden below `md`. */
export default function AuthBrandPanel() {
  const theme = useTheme();
  const white = theme.palette.common.white;

  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: "46%",
        flexShrink: 0,
        p: 6,
        position: "relative",
        overflow: "hidden",
        color: white,
        background: `linear-gradient(150deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main} 45%, ${theme.palette.primary.light})`,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        onClick={() => window.location.assign("/")}
        sx={{ mb: 1, cursor: "pointer" }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 2.5,
            bgcolor: alpha(white, 0.18),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ShoppingCartIcon width="20" height="20" stroke={white} />
        </Box>
        <Typography variant="h6" fontWeight={700} color="inherit">
          EliteCart
        </Typography>
      </Stack>

      <Stack sx={{ flex: 1, justifyContent: "center", py: 4 }}>
        <Typography
          variant="h2"
          fontWeight={700}
          color="inherit"
          sx={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
        >
          Everything your store needs, in one place.
        </Typography>
        <Typography
          color="inherit"
          sx={{ mt: 2.5, maxWidth: 380, opacity: 0.92, fontSize: 17, lineHeight: 1.5 }}
        >
          Sign in to manage your cart, track orders, and pick up right where you
          left off.
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <ReviewSlider reviews={REVIEWS} />

        <Stack direction="row" spacing={2.5} sx={{ opacity: 0.85 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon width="16" height="16" stroke={white} />
            <Typography color="inherit" sx={{ fontSize: 13 }}>
              SOC 2 Type II
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <ShieldIcon width="16" height="16" stroke={white} />
            <Typography color="inherit" sx={{ fontSize: 13 }}>
              256-bit encryption
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
