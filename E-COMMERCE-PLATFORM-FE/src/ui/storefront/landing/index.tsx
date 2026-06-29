"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Chip,
  Container,
  InputBase,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ArrowIcon, ShieldIcon, ShoppingCartIcon } from "@/assets/icons/common";
import ProductCard from "@/ui/storefront/product-card";
import { PATHS } from "@/constants/routes";
import {
  useGetCategoriesQuery,
  useGetProductsQuery,
} from "@/store/products/products.api";

const TRUST = [
  { title: "Free shipping", caption: "On orders over $100", Icon: ShoppingCartIcon },
  { title: "30-day returns", caption: "No questions asked", Icon: ArrowIcon },
  { title: "Secure checkout", caption: "256-bit encryption", Icon: ShieldIcon },
];

function SectionHeading({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-end"
      sx={{ mb: 2.5 }}
    >
      <Typography variant="h4" fontWeight={700}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="primary.main"
        fontWeight={600}
        sx={{ cursor: "pointer" }}
        onClick={onAction}
      >
        {actionLabel}
      </Typography>
    </Stack>
  );
}

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { data: featured, isLoading: loadingFeatured } = useGetProductsQuery({
    limit: 4,
    sort: "top_rated",
  });
  const { data: categories = [] } = useGetCategoriesQuery();

  const goCatalog = () => router.push(PATHS.catalog);

  const handleSubscribe = () => {
    if (!email.trim()) {
      toast.error("Enter an email to subscribe");
      return;
    }
    toast.success("You're subscribed — watch your inbox for deals");
    setEmail("");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero */}
      <Box
        sx={{
          borderRadius: 5,
          p: { xs: 4, md: 7 },
          color: "common.white",
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light})`,
        }}
      >
        <Box sx={{ position: "relative", maxWidth: 540 }}>
          <Chip
            label="Spring sale · up to 40% off"
            sx={{
              mb: 2.5,
              color: "common.white",
              fontWeight: 600,
              bgcolor: (theme) => alpha(theme.palette.common.white, 0.18),
            }}
          />
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{ letterSpacing: "-0.02em", lineHeight: 1.1 }}
          >
            Sound, redefined for every room.
          </Typography>
          <Typography sx={{ mt: 2, mb: 3.5, opacity: 0.92, maxWidth: 440, fontSize: 17 }}>
            Premium audio, computing and smart home gear — curated, fairly
            priced, and delivered fast.
          </Typography>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={goCatalog}
              sx={{ bgcolor: "common.white", color: "primary.main", "&:hover": { bgcolor: "common.white" } }}
            >
              Shop now
            </Button>
            <Button
              variant="outlined"
              onClick={goCatalog}
              sx={{
                color: "common.white",
                borderColor: (theme) => alpha(theme.palette.common.white, 0.5),
                "&:hover": { borderColor: "common.white" },
              }}
            >
              Browse deals
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Trust strip */}
      <Box
        sx={{
          mt: 3,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
        }}
      >
        {TRUST.map(({ title, caption, Icon }) => (
          <Stack
            key={title}
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ p: 2.25, border: 1, borderColor: "divider", borderRadius: 3.5 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              }}
            >
              <Icon width="20" height="20" stroke="currentColor" />
            </Box>
            <Box>
              <Typography fontWeight={600} variant="body2">
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {caption}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>

      {/* Categories */}
      <Box sx={{ mt: 6 }}>
        <SectionHeading title="Shop by category" actionLabel="View all" onAction={goCatalog} />
        <Box
          sx={{
            display: "grid",
            gap: 1.75,
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(6, 1fr)",
            },
          }}
        >
          {categories.map((entry) => (
            <Stack
              key={entry.category}
              alignItems="center"
              spacing={1.25}
              onClick={() =>
                router.push(`${PATHS.catalog}?category=${encodeURIComponent(entry.category)}`)
              }
              sx={{
                p: 2.5,
                border: 1,
                borderColor: "divider",
                borderRadius: 3.5,
                cursor: "pointer",
                "&:hover": { borderColor: "primary.light", bgcolor: "action.hover" },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "primary.main",
                  fontWeight: 700,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                {entry.category.charAt(0)}
              </Box>
              <Typography variant="body2" fontWeight={600}>
                {entry.category}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Box>

      {/* Featured products */}
      <Box sx={{ mt: 6 }}>
        <SectionHeading title="Featured products" actionLabel="See more" onAction={goCatalog} />
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
          {loadingFeatured
            ? Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="rounded"
                  height={320}
                  sx={{ borderRadius: 4 }}
                />
              ))
            : featured?.records.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onOpen={() => router.push(PATHS.product(product._id))}
                />
              ))}
        </Box>
      </Box>

      {/* Newsletter */}
      <Box
        sx={{
          mt: 6,
          p: { xs: 3, md: 5 },
          textAlign: "center",
          border: 1,
          borderColor: "divider",
          borderRadius: 4.5,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          Get 10% off your first order
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>
          Join our newsletter for early access to drops and deals.
        </Typography>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.25}
          sx={{ maxWidth: 440, mx: "auto" }}
        >
          <InputBase
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            inputProps={{ "aria-label": "Email address" }}
            sx={{
              flex: 1,
              height: 48,
              px: 2,
              borderRadius: 3,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.default",
            }}
          />
          <Button variant="contained" onClick={handleSubscribe} sx={{ height: 48, px: 3 }}>
            Subscribe
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
