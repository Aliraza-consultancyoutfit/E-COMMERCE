"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { CrossIcon, TickIcon } from "@/assets/icons/common";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { PATHS } from "@/constants/routes";
import { useGetCartQuery } from "@/store/cart/cart.api";
import { useCheckoutMutation } from "@/store/orders/order.api";
import type { Order } from "@/store/orders/order.types";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format";

const STEPS = ["Shipping", "Billing", "Payment", "Review"];
const STEP_FIELDS: Record<number, (keyof CheckoutValues)[]> = {
  1: ["firstName", "lastName", "street", "city", "zip"],
  2: ["sameAsShipping"],
  3: ["cardNumber", "expiry", "cvc", "nameOnCard"],
  4: [],
};

const schema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  street: yup.string().trim().required("Street address is required"),
  city: yup.string().trim().required("City is required"),
  zip: yup.string().trim().required("ZIP code is required"),
  sameAsShipping: yup.boolean().default(true),
  cardNumber: yup
    .string()
    .required("Card number is required")
    .test("len", "Enter a valid card number", (v) =>
      Boolean(v && v.replace(/\D/g, "").length >= 12),
    ),
  expiry: yup.string().trim().required("Expiry is required"),
  cvc: yup.string().trim().min(3, "Invalid CVC").required("CVC is required"),
  nameOnCard: yup.string().trim().required("Name on card is required"),
});

type CheckoutValues = yup.InferType<typeof schema>;

type View = "steps" | "success" | "failure";

function Stepper({ step }: { step: number }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ mb: 4, maxWidth: 680 }}>
      {STEPS.map((label, index) => {
        const position = index + 1;
        const done = position < step;
        const active = position === step;
        return (
          <Stack key={label} direction="row" alignItems="center" sx={{ flex: index < STEPS.length - 1 ? 1 : "0 0 auto" }}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: 14,
                  flexShrink: 0,
                  color: done || active ? "primary.contrastText" : "text.secondary",
                  bgcolor: done
                    ? "success.main"
                    : active
                      ? "primary.main"
                      : "background.default",
                  border: done || active ? "none" : 1,
                  borderColor: "divider",
                }}
              >
                {done ? <TickIcon width="16" height="16" stroke="currentColor" /> : position}
              </Box>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{
                  whiteSpace: "nowrap",
                  display: { xs: "none", sm: "block" },
                  color: position <= step ? "text.primary" : "text.secondary",
                }}
              >
                {label}
              </Typography>
            </Stack>
            {index < STEPS.length - 1 && (
              <Box
                sx={{
                  flex: 1,
                  height: 2,
                  mx: 1.75,
                  bgcolor: position < step ? "success.main" : "divider",
                }}
              />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}

export default function Checkout() {
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useGetCartQuery();
  const [checkout, { isLoading: placing }] = useCheckoutMutation();

  const [step, setStep] = useState(1);
  const [view, setView] = useState<View>("steps");
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const methods = useForm<CheckoutValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      zip: "",
      sameAsShipping: true,
      cardNumber: "",
      expiry: "",
      cvc: "",
      nameOnCard: "",
    },
  });

  const placeOrder = methods.handleSubmit(async (values) => {
    try {
      const order = await checkout({
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          street: values.street,
          city: values.city,
          zip: values.zip,
        },
        payment: {
          cardNumber: values.cardNumber,
          expiry: values.expiry,
          cvc: values.cvc,
          nameOnCard: values.nameOnCard,
        },
      }).unwrap();
      setPlacedOrder(order);
      setView("success");
    } catch (error) {
      const status = (error as { status?: number })?.status;
      if (status === 402) {
        setView("failure");
      } else {
        toast.error(getApiErrorMessage(error));
      }
    }
  });

  const handleNext = async () => {
    if (step < 4) {
      const valid = await methods.trigger(STEP_FIELDS[step]);
      if (valid) {
        setStep((prev) => prev + 1);
      }
      return;
    }
    await placeOrder();
  };

  // ----- Success -----
  if (view === "success" && placedOrder) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            mx: "auto",
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "success.main",
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.14),
          }}
        >
          <TickIcon width="40" height="40" stroke="currentColor" />
        </Box>
        <Typography variant="h4" fontWeight={700}>
          Order confirmed
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.6 }}>
          Thank you! Your order{" "}
          <Box component="span" sx={{ color: "text.primary", fontWeight: 600 }}>
            #{placedOrder._id.slice(-6).toUpperCase()}
          </Box>{" "}
          has been placed. A receipt has been emailed to you.
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 3, mb: 3, textAlign: "left" }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              Estimated delivery
            </Typography>
            <Typography fontWeight={600}>3–5 business days</Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="body2" color="text.secondary">
              Total paid
            </Typography>
            <Typography fontWeight={600}>{formatCurrency(placedOrder.total)}</Typography>
          </Box>
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button fullWidth variant="outlined" size="large" onClick={() => router.push(PATHS.home)} sx={{ height: 48 }}>
            Back to home
          </Button>
          <Button fullWidth variant="contained" size="large" onClick={() => router.push(PATHS.catalog)} sx={{ height: 48 }}>
            Continue shopping
          </Button>
        </Stack>
      </Container>
    );
  }

  // ----- Failure -----
  if (view === "failure") {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            mx: "auto",
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "error.main",
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.12),
          }}
        >
          <CrossIcon width="38" height="38" stroke="currentColor" />
        </Box>
        <Typography variant="h4" fontWeight={700}>
          Payment failed
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.6 }}>
          Your card was declined and no charge was made. Check your details or
          try a different card.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button fullWidth variant="outlined" size="large" onClick={() => router.push(PATHS.cart)} sx={{ height: 48 }}>
            Back to cart
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              setStep(3);
              setView("steps");
            }}
            sx={{ height: 48 }}
          >
            Try again
          </Button>
        </Stack>
      </Container>
    );
  }

  // ----- Empty cart guard -----
  if (!cartLoading && (!cart || cart.items.length === 0)) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>
          Add a few products before checking out.
        </Typography>
        <Button variant="contained" size="large" onClick={() => router.push(PATHS.catalog)}>
          Browse products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stepper step={step} />
      <Box
        sx={{
          display: "grid",
          gap: 3.5,
          alignItems: "start",
          gridTemplateColumns: { xs: "1fr", md: "1fr 360px" },
        }}
      >
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3.5 }}>
          <FormProvider methods={methods} onSubmit={placeOrder}>
            {step === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                  Shipping address
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
                  <RHFTextField name="firstName" label="First name" />
                  <RHFTextField name="lastName" label="Last name" />
                  <Box sx={{ gridColumn: { sm: "span 2" } }}>
                    <RHFTextField name="street" label="Street address" />
                  </Box>
                  <RHFTextField name="city" label="City" />
                  <RHFTextField name="zip" label="ZIP code" />
                </Box>
              </Box>
            )}

            {step === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                  Billing address
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: "primary.main",
                    borderRadius: 3,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    mb: 2,
                  }}
                >
                  <RHFCheckbox name="sameAsShipping" label="Same as shipping address" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  We&apos;ll bill the card you enter next. Uncheck the box above
                  to use a different billing address.
                </Typography>
              </Box>
            )}

            {step === 3 && (
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                  <Typography variant="h6" fontWeight={700}>
                    Payment
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mock payment — no real charge
                  </Typography>
                </Stack>
                <Stack spacing={2}>
                  <RHFTextField name="cardNumber" label="Card number" placeholder="4242 4242 4242 4242" />
                  <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <RHFTextField name="expiry" label="Expiry" placeholder="08 / 28" />
                    <RHFTextField name="cvc" label="CVC" placeholder="123" />
                  </Box>
                  <RHFTextField name="nameOnCard" label="Name on card" placeholder="Jane Cooper" />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                  Use <b>4242…</b> to succeed or <b>4000…</b> to simulate a decline.
                </Typography>
              </Box>
            )}

            {step === 4 && (
              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2.5 }}>
                  Review your order
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".05em", mb: 0.5 }}>
                      Ship to
                    </Typography>
                    <Typography variant="body2">
                      {methods.getValues("firstName")} {methods.getValues("lastName")} ·{" "}
                      {methods.getValues("street")}, {methods.getValues("city")} {methods.getValues("zip")}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: ".05em", mb: 0.5 }}>
                      Payment
                    </Typography>
                    <Typography variant="body2">
                      Card ending {methods.getValues("cardNumber").replace(/\D/g, "").slice(-4) || "••••"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            <Stack direction="row" spacing={1.5} sx={{ mt: 3.5 }}>
              {step > 1 && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setStep((prev) => prev - 1)}
                  sx={{ height: 48 }}
                >
                  Back
                </Button>
              )}
              <Button
                type="button"
                variant="contained"
                size="large"
                fullWidth
                disabled={placing}
                onClick={handleNext}
                sx={{ height: 48 }}
              >
                {step < 4 ? "Continue" : placing ? "Placing order…" : "Place order"}
              </Button>
            </Stack>
          </FormProvider>
        </Box>

        {/* Summary */}
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 2.75 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Order summary
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 1.5 }}>
            {cart?.items.map((line) => (
              <Stack key={line.product._id} direction="row" justifyContent="space-between" spacing={1}>
                <Typography variant="body2" sx={{ flex: 1, minWidth: 0 }} noWrap>
                  {line.product.name}{" "}
                  <Box component="span" color="text.secondary">
                    × {line.quantity}
                  </Box>
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {formatCurrency(line.lineTotal)}
                </Typography>
              </Stack>
            ))}
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          {cart && (
            <>
              <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" fontWeight={600}>{formatCurrency(cart.summary.subtotal)}</Typography>
              </Stack>
              {cart.summary.discount > 0 && (
                <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                  <Typography variant="body2" color="success.main">Discount</Typography>
                  <Typography variant="body2" fontWeight={600} color="success.main">
                    -{formatCurrency(cart.summary.discount)}
                  </Typography>
                </Stack>
              )}
              <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Shipping</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {cart.summary.shipping === 0 ? "Free" : formatCurrency(cart.summary.shipping)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" sx={{ py: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Tax</Typography>
                <Typography variant="body2" fontWeight={600}>{formatCurrency(cart.summary.tax)}</Typography>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography fontWeight={700}>Total</Typography>
                <Typography variant="h5" fontWeight={700}>{formatCurrency(cart.summary.total)}</Typography>
              </Stack>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
