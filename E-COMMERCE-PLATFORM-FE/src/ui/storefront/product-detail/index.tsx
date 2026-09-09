"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Container,
  Link as MuiLink,
  Rating,
  Skeleton,
  Stack,
  TextField,
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
  useCreateProductReviewMutation,
  useGetProductQuery,
  useGetProductReviewsQuery,
  useGetProductsQuery,
} from "@/store/products/products.api";
import { useGetMyOrdersQuery } from "@/store/orders/order.api";
import { useAppSelector } from "@/store/hooks";
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
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const { add, isLoading: isAdding } = useAddToCart();
  const { toggle, isWishlisted, isBusy: isWishlistBusy } = useWishlistToggle();
  const { data: product, isLoading, isError, refetch } =
    useGetProductQuery(id);
  const {
    data: reviews = [],
    isLoading: isReviewsLoading,
    refetch: refetchReviews,
  } = useGetProductReviewsQuery(id);
  const { data: orders = [], isLoading: isOrdersLoading } = useGetMyOrdersQuery(
    undefined,
    { skip: !user },
  );
  const [createReview, { isLoading: isCreatingReview }] =
    useCreateProductReviewMutation();

  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(searchParams.get("tab") === "reviews" ? 2 : 0);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const [reviewRating, setReviewRating] = useState<number | null>(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  const gallery =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image
        ? [product.image]
        : [];
  const mainImage = gallery[activeImage] ?? gallery[0];

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
  const purchasedProduct = orders.some(
    (order) =>
      order.status !== "cancelled" &&
      order.items.some((item) => item.product === product._id),
  );
  const myReview = user
    ? reviews.find((review) => review.user === user.id)
    : undefined;

  const handleAddToCart = () => add(product._id, qty);
  const handleBuyNow = async () => {
    const added = await add(product._id, qty);
    if (added) {
      router.push(PATHS.cart);
    }
  };
  const handleReviewSubmit = async () => {
    if (!reviewRating) {
      return;
    }

    try {
      await createReview({
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle.trim(),
        comment: reviewComment.trim(),
      }).unwrap();
      setReviewTitle("");
      setReviewComment("");
      setReviewRating(5);
      await refetchReviews();
      toast.success("Review added");
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: unknown } }).data?.message === "string"
          ? (error as { data: { message: string } }).data.message
          : "Could not add review";
      toast.error(message);
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
            onMouseEnter={() => {
              if (mainImage) setZoom((z) => ({ ...z, active: true }));
            }}
            onMouseLeave={() => setZoom({ active: false, x: 50, y: 50 })}
            onMouseMove={(e) => {
              if (!mainImage) return;
              const rect = e.currentTarget.getBoundingClientRect();
              setZoom({
                active: true,
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
              });
            }}
            sx={{
              position: "relative",
              aspectRatio: "1 / 1",
              borderRadius: 5,
              mb: 1.75,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: mainImage ? "zoom-in" : "default",
              color: (theme) => alpha(theme.palette.text.primary, 0.25),
              background: (theme) => categoryGradient(theme, product.category),
            }}
          >
            {mainImage ? (
              <Box
                component="img"
                src={mainImage}
                alt={product.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.15s ease-out",
                  transform: zoom.active ? "scale(2.2)" : "scale(1)",
                  transformOrigin: `${zoom.x}% ${zoom.y}%`,
                }}
              />
            ) : (
              <CategoryGlyph category={product.category} size={120} />
            )}
          </Box>
          {gallery.length > 1 && (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5 }}>
              {gallery.map((src, index) => {
                const active = index === activeImage;
                return (
                  <Box
                    key={`${index}-${src.slice(-12)}`}
                    component="button"
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={active}
                    onClick={() => setActiveImage(index)}
                    sx={{
                      p: 0,
                      aspectRatio: "1 / 1",
                      borderRadius: 3,
                      overflow: "hidden",
                      cursor: "pointer",
                      border: 2,
                      borderColor: active ? "primary.main" : "divider",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Box
                      component="img"
                      src={src}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
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
          <Stack spacing={2.5}>
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

            {user ? (
              <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.5 }}>
                {myReview ? (
                  <Typography variant="body2" color="text.secondary">
                    You already reviewed this product. Thanks for sharing your experience.
                  </Typography>
                ) : isOrdersLoading ? (
                  <Skeleton variant="rounded" height={118} />
                ) : purchasedProduct ? (
                  <Stack spacing={1.75}>
                    <Typography fontWeight={700}>Write a review</Typography>
                    <Rating
                      value={reviewRating}
                      onChange={(_event, value) => setReviewRating(value)}
                    />
                    <TextField
                      label="Title"
                      value={reviewTitle}
                      onChange={(event) => setReviewTitle(event.target.value)}
                      inputProps={{ maxLength: 80 }}
                      fullWidth
                    />
                    <TextField
                      label="Review"
                      value={reviewComment}
                      onChange={(event) => setReviewComment(event.target.value)}
                      inputProps={{ maxLength: 1000 }}
                      multiline
                      minRows={4}
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      disabled={
                        isCreatingReview ||
                        !reviewRating ||
                        reviewTitle.trim().length < 3 ||
                        reviewComment.trim().length < 10
                      }
                      onClick={handleReviewSubmit}
                      sx={{ alignSelf: "flex-start" }}
                    >
                      Submit review
                    </Button>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Buy this product first to leave a verified review.
                  </Typography>
                )}
              </Box>
            ) : (
              <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.5 }}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                  <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                    Sign in with the account used for checkout to leave a verified review.
                  </Typography>
                  <Button variant="outlined" onClick={() => router.push(PATHS.auth.signIn)}>
                    Sign in
                  </Button>
                </Stack>
              </Box>
            )}

            {isReviewsLoading ? (
              <Stack spacing={1.5}>
                <Skeleton variant="rounded" height={112} />
                <Skeleton variant="rounded" height={112} />
              </Stack>
            ) : reviews.length > 0 ? (
              <Stack spacing={1.5}>
                {reviews.map((review) => (
                  <Box
                    key={review._id}
                    sx={{
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 4,
                      p: 2.5,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                      sx={{ mb: 1 }}
                    >
                      <Box>
                        <Typography fontWeight={700}>{review.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {review.userName} -{" "}
                          {new Date(review.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Rating value={review.rating} readOnly size="small" />
                    </Stack>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {review.comment}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No customer reviews yet.
              </Typography>
            )}
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
