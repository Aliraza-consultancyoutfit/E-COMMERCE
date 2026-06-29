"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputBase,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import {
  CrossIcon,
  ShieldIcon,
  ShoppingCartIcon,
} from "@/assets/icons/common";
import ApiErrorState from "@/components/api-error-state";
import QuantityStepper from "@/ui/storefront/quantity-stepper";
import {
  CategoryGlyph,
  categoryGradient,
} from "@/ui/storefront/category-visuals";
import { PATHS } from "@/constants/routes";
import {
  useApplyCouponMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/store/cart/cart.api";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format";

function SummaryRow({
  label,
  value,
  emphasizeColor,
}: {
  label: string;
  value: string;
  emphasizeColor?: string;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.75 }}>
      <Typography variant="body2" sx={{ color: emphasizeColor ?? "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ color: emphasizeColor }}>
        {value}
      </Typography>
    </Stack>
  );
}

export default function Cart() {
  const router = useRouter();
  const { data: cart, isLoading, isError, refetch } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const [applyCoupon, { isLoading: applyingCoupon }] = useApplyCouponMutation();
  const [coupon, setCoupon] = useState("");

  const handleUpdate = async (productId: string, quantity: number) => {
    try {
      await updateItem({ productId, quantity }).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeItem(productId).unwrap();
      toast.success("Removed from cart");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) {
      return;
    }
    try {
      await applyCoupon(coupon.trim()).unwrap();
      toast.success("Coupon applied");
      setCoupon("");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        Shopping cart
      </Typography>

      {isLoading ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={110} />
          <Skeleton variant="rounded" height={110} />
        </Stack>
      ) : isError ? (
        <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />
      ) : !cart || cart.items.length === 0 ? (
        <Stack alignItems="center" sx={{ py: 10, textAlign: "center" }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
              color: "text.secondary",
              bgcolor: "background.paper",
              border: 1,
              borderColor: "divider",
            }}
          >
            <ShoppingCartIcon width="38" height="38" stroke="currentColor" />
          </Box>
          <Typography variant="h5" fontWeight={700}>
            Your cart is empty
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>
            Looks like you haven&apos;t added anything yet.
          </Typography>
          <Button variant="contained" size="large" onClick={() => router.push(PATHS.catalog)}>
            Continue shopping
          </Button>
        </Stack>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 3.5,
            alignItems: "start",
            gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
          }}
        >
          {/* Line items */}
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden" }}>
            {cart.items.map((line) => (
              <Stack
                key={line.product._id}
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{ p: 2.25, borderBottom: 1, borderColor: "divider" }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: (theme) => alpha(theme.palette.text.primary, 0.25),
                    background: (theme) =>
                      categoryGradient(theme, line.product.category),
                  }}
                >
                  <CategoryGlyph category={line.product.category} size={32} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontWeight={600} noWrap>
                    {line.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {line.product.category} · {formatCurrency(line.product.price)}
                  </Typography>
                </Box>
                <QuantityStepper
                  value={line.quantity}
                  min={1}
                  max={Math.max(1, line.product.stock)}
                  onChange={(quantity) => handleUpdate(line.product._id, quantity)}
                />
                <Typography
                  fontWeight={700}
                  sx={{ width: 84, textAlign: "right", display: { xs: "none", sm: "block" } }}
                >
                  {formatCurrency(line.lineTotal)}
                </Typography>
                <IconButton
                  aria-label={`Remove ${line.product.name}`}
                  onClick={() => handleRemove(line.product._id)}
                  sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                >
                  <CrossIcon width="18" height="18" stroke="currentColor" />
                </IconButton>
              </Stack>
            ))}
            <Box sx={{ p: 2.25 }}>
              <Typography
                component="span"
                variant="body2"
                color="primary.main"
                fontWeight={600}
                sx={{ cursor: "pointer" }}
                onClick={() => router.push(PATHS.catalog)}
              >
                ← Continue shopping
              </Typography>
            </Box>
          </Box>

          {/* Order summary */}
          <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.75 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2.25 }}>
              Order summary
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <InputBase
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="Coupon code"
                inputProps={{ "aria-label": "Coupon code" }}
                sx={{
                  flex: 1,
                  height: 42,
                  px: 1.5,
                  borderRadius: 2.5,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "background.default",
                }}
              />
              <Button
                variant="outlined"
                onClick={handleApplyCoupon}
                disabled={applyingCoupon}
                sx={{ height: 42 }}
              >
                Apply
              </Button>
            </Stack>
            {cart.coupon && (
              <Typography variant="body2" color="success.main" fontWeight={600} sx={{ mb: 1 }}>
                Coupon {cart.coupon} applied
              </Typography>
            )}

            <Box sx={{ mt: 1 }}>
              <SummaryRow label="Subtotal" value={formatCurrency(cart.summary.subtotal)} />
              {cart.summary.discount > 0 && (
                <SummaryRow
                  label="Discount"
                  value={`-${formatCurrency(cart.summary.discount)}`}
                  emphasizeColor="success.main"
                />
              )}
              <SummaryRow
                label="Shipping"
                value={cart.summary.shipping === 0 ? "Free" : formatCurrency(cart.summary.shipping)}
              />
              <SummaryRow label="Tax" value={formatCurrency(cart.summary.tax)} />
            </Box>

            <Divider sx={{ my: 1.5 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.25 }}>
              <Typography fontWeight={700}>Total</Typography>
              <Typography variant="h5" fontWeight={700}>
                {formatCurrency(cart.summary.total)}
              </Typography>
            </Stack>

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={() => router.push(PATHS.checkout)}
              sx={{ height: 50 }}
            >
              Proceed to checkout
            </Button>
            <Stack direction="row" spacing={0.875} justifyContent="center" alignItems="center" sx={{ mt: 1.75 }}>
              <Box sx={{ color: "text.secondary", display: "flex" }}>
                <ShieldIcon width="14" height="14" stroke="currentColor" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Secure SSL checkout
              </Typography>
            </Stack>
          </Box>
        </Box>
      )}
    </Container>
  );
}
