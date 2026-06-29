"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { CrossIcon, TickIcon } from "@/assets/icons/common";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import RHFCheckbox from "@/components/react-hook-form/rhf-checkbox";
import { PATHS } from "@/constants/routes";
import { useGetCartQuery } from "@/store/cart/cart.api";
import {
  useCheckoutMutation,
  useCompleteSessionMutation,
  useCreateCheckoutSessionMutation,
  useCreatePaymentIntentMutation,
} from "@/store/orders/order.api";
import type { Order } from "@/store/orders/order.types";
import { getApiErrorMessage } from "@/utils/api-error";
import { formatCurrency } from "@/utils/format";
import { stripePromise } from "@/utils/stripe";

const STEPS = ["Shipping", "Billing", "Payment", "Review"];

const schema = yup.object({
  firstName: yup.string().trim().required("First name is required"),
  lastName: yup.string().trim().required("Last name is required"),
  street: yup.string().trim().required("Street address is required"),
  city: yup.string().trim().required("City is required"),
  zip: yup.string().trim().required("ZIP code is required"),
  sameAsShipping: yup.boolean().default(true),
  nameOnCard: yup.string().trim().default(""),
});

type CheckoutValues = yup.InferType<typeof schema>;
type View = "steps" | "success" | "failure";
type PayMethod = "card" | "stripe";

const SHIPPING_FIELDS: (keyof CheckoutValues)[] = ["firstName", "lastName", "street", "city", "zip"];

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
                  bgcolor: done ? "success.main" : active ? "primary.main" : "background.default",
                  border: done || active ? "none" : 1,
                  borderColor: "divider",
                }}
              >
                {done ? <TickIcon width="16" height="16" stroke="currentColor" /> : position}
              </Box>
              <Typography
                variant="body2"
                fontWeight={600}
                sx={{ whiteSpace: "nowrap", display: { xs: "none", sm: "block" }, color: position <= step ? "text.primary" : "text.secondary" }}
              >
                {label}
              </Typography>
            </Stack>
            {index < STEPS.length - 1 && (
              <Box sx={{ flex: 1, height: 2, mx: 1.75, bgcolor: position < step ? "success.main" : "divider" }} />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}

function CheckoutInner() {
  const router = useRouter();
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const { data: cart, isLoading: cartLoading } = useGetCartQuery();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [checkout] = useCheckoutMutation();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [completeSession] = useCompleteSessionMutation();

  const [step, setStep] = useState(1);
  const [view, setView] = useState<View>("steps");
  const [method, setMethod] = useState<PayMethod>("stripe");
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completingSession, setCompletingSession] = useState(false);
  const [card, setCard] = useState({ number: false, expiry: false, cvc: false });
  const cardComplete = card.number && card.expiry && card.cvc;
  const sessionHandled = useRef(false);
  const [stripeFailed, setStripeFailed] = useState(false);

  // If Stripe.js never initializes (ad-blocker / no network / missing key),
  // the card iframes stay empty and un-typeable — fall back to the hosted
  // Stripe Checkout method, which doesn't depend on Stripe.js in the browser.
  useEffect(() => {
    if (stripe) {
      setStripeFailed(false);
      return;
    }
    const timer = setTimeout(() => {
      setStripeFailed(true);
      setMethod("stripe");
    }, 6000);
    return () => clearTimeout(timer);
  }, [stripe]);

  const methods = useForm<CheckoutValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      street: "",
      city: "",
      zip: "",
      sameAsShipping: true,
      nameOnCard: "",
    },
  });

  // Handle the return from Stripe-hosted Checkout (?session_id / ?canceled).
  useEffect(() => {
    if (sessionHandled.current) return;
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const canceled = params.get("canceled");
    if (!sessionId && !canceled) return;
    sessionHandled.current = true;
    window.history.replaceState({}, "", PATHS.checkout);

    if (canceled) {
      setView("failure");
      return;
    }
    if (sessionId) {
      setCompletingSession(true);
      completeSession({ sessionId })
        .unwrap()
        .then((order) => {
          setPlacedOrder(order);
          setView("success");
        })
        .catch((error) => toast.error(getApiErrorMessage(error)))
        .finally(() => setCompletingSession(false));
    }
  }, [completeSession]);

  const elementStyle = {
    style: {
      base: {
        color: theme.palette.text.primary,
        fontFamily: "inherit",
        fontSize: "16px",
        "::placeholder": { color: theme.palette.text.secondary },
      },
      invalid: { color: theme.palette.error.main },
    },
  };

  const fieldBoxSx = {
    px: 1.75,
    py: 1.75,
    border: 1,
    borderColor: "divider",
    borderRadius: 3,
    bgcolor: "background.paper",
    "&:focus-within": { borderColor: "primary.main", boxShadow: (t: typeof theme) => `0 0 0 3px ${alpha(t.palette.primary.main, 0.18)}` },
  };

  const payWithCard = methods.handleSubmit(async (values) => {
    const cardNumber = elements?.getElement(CardNumberElement);
    if (!stripe || !cardNumber) {
      // Stripe.js didn't load (commonly an ad-blocker) — switch to the hosted
      // Checkout method, which doesn't depend on the in-page Stripe iframe.
      setMethod("stripe");
      setStep(3);
      toast.error("Card form couldn't load — use Stripe Checkout to continue.");
      return;
    }
    if (!values.nameOnCard) {
      methods.setError("nameOnCard", { message: "Name on card is required" });
      return;
    }
    setSubmitting(true);
    try {
      const { clientSecret } = await createPaymentIntent().unwrap();
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardNumber, billing_details: { name: values.nameOnCard } },
      });
      if (result.error || result.paymentIntent?.status !== "succeeded") {
        setView("failure");
        return;
      }
      const order = await checkout({
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          street: values.street,
          city: values.city,
          zip: values.zip,
        },
        paymentIntentId: result.paymentIntent.id,
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
    } finally {
      setSubmitting(false);
    }
  });

  const payWithStripe = async () => {
    const values = methods.getValues();
    setSubmitting(true);
    try {
      const { url } = await createCheckoutSession({
        shippingAddress: {
          firstName: values.firstName,
          lastName: values.lastName,
          street: values.street,
          city: values.city,
          zip: values.zip,
        },
      }).unwrap();
      if (url) {
        window.location.href = url;
      } else {
        toast.error("Could not start Stripe Checkout");
        setSubmitting(false);
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error));
      setSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (step < 4) {
      const valid = await methods.trigger(step === 1 ? SHIPPING_FIELDS : []);
      if (step === 3 && method === "card" && !cardComplete) {
        toast.error("Enter your card details");
        return;
      }
      if (valid) {
        setStep((prev) => prev + 1);
      }
      return;
    }
    if (method === "card") {
      await payWithCard();
    } else {
      await payWithStripe();
    }
  };

  // ----- Completing hosted session -----
  if (completingSession) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" fontWeight={700} sx={{ mt: 3 }}>
          Confirming your payment…
        </Typography>
      </Container>
    );
  }

  // ----- Success -----
  if (view === "success" && placedOrder) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
        <Box sx={{ width: 80, height: 80, borderRadius: "50%", mx: "auto", mb: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "success.main", bgcolor: (t) => alpha(t.palette.success.main, 0.14) }}>
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
        <Stack direction="row" justifyContent="space-between" sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 3, mb: 3, textAlign: "left" }}>
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
        <Box sx={{ width: 80, height: 80, borderRadius: "50%", mx: "auto", mb: 3, display: "flex", alignItems: "center", justifyContent: "center", color: "error.main", bgcolor: (t) => alpha(t.palette.error.main, 0.12) }}>
          <CrossIcon width="38" height="38" stroke="currentColor" />
        </Box>
        <Typography variant="h4" fontWeight={700}>
          Payment not completed
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5, mb: 3, lineHeight: 1.6 }}>
          No charge was made. Check your details or try a different card.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button fullWidth variant="outlined" size="large" onClick={() => router.push(PATHS.cart)} sx={{ height: 48 }}>
            Back to cart
          </Button>
          <Button fullWidth variant="contained" size="large" onClick={() => { setStep(3); setView("steps"); }} sx={{ height: 48 }}>
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
      <Box sx={{ display: "grid", gap: 3.5, alignItems: "start", gridTemplateColumns: { xs: "1fr", md: "1fr 360px" } }}>
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3.5 }}>
          <FormProvider methods={methods} onSubmit={payWithCard}>
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
                <Box sx={{ p: 2, border: 1, borderColor: "primary.main", borderRadius: 3, bgcolor: (t) => alpha(t.palette.primary.main, 0.08), mb: 2 }}>
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
                    Secured by Stripe · test mode
                  </Typography>
                </Stack>

                {/* Payment method toggle */}
                <Stack direction="row" spacing={1} sx={{ p: 0.5, mb: 2.5, borderRadius: 2.5, border: 1, borderColor: "divider", bgcolor: "background.default", width: "fit-content" }}>
                  {([["card", "Card"], ["stripe", "Stripe Checkout"]] as const).map(([value, label]) => {
                    const activeMethod = method === value;
                    return (
                      <Box
                        key={value}
                        component="button"
                        type="button"
                        onClick={() => setMethod(value)}
                        sx={{
                          px: 2,
                          py: 0.85,
                          border: "none",
                          borderRadius: 1.75,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          color: activeMethod ? "primary.main" : "text.secondary",
                          bgcolor: activeMethod ? "background.paper" : "transparent",
                          boxShadow: activeMethod ? 1 : "none",
                        }}
                      >
                        {label}
                      </Box>
                    );
                  })}
                </Stack>

                {method === "card" ? (
                  <Stack spacing={2}>
                    {stripeFailed && (
                      <Box sx={{ p: 2, border: 1, borderColor: "warning.main", borderRadius: 3, bgcolor: (t) => alpha(t.palette.warning.main, 0.1) }}>
                        <Typography variant="body2" fontWeight={600} color="warning.main" sx={{ mb: 0.5 }}>
                          Secure card form couldn&apos;t load
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          An ad-blocker or privacy extension may be blocking
                          js.stripe.com. Disable it for this site (or open in a
                          private window), or use <b>Stripe Checkout</b> above —
                          it opens Stripe&apos;s own page instead.
                        </Typography>
                      </Box>
                    )}
                    <RHFTextField name="nameOnCard" label="Name on card" placeholder="Jane Cooper" />
                    <Box>
                      <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>
                        Card number
                      </Typography>
                      <Box sx={fieldBoxSx}>
                        <CardNumberElement options={elementStyle} onChange={(e) => setCard((c) => ({ ...c, number: e.complete }))} />
                      </Box>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>
                          Expiry
                        </Typography>
                        <Box sx={fieldBoxSx}>
                          <CardExpiryElement options={elementStyle} onChange={(e) => setCard((c) => ({ ...c, expiry: e.complete }))} />
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75 }}>
                          CVC
                        </Typography>
                        <Box sx={fieldBoxSx}>
                          <CardCvcElement options={elementStyle} onChange={(e) => setCard((c) => ({ ...c, cvc: e.complete }))} />
                        </Box>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Test card <b>4242 4242 4242 4242</b>, any future expiry, any CVC. Use{" "}
                      <b>4000 0000 0000 0002</b> to simulate a decline.
                    </Typography>
                  </Stack>
                ) : (
                  <Box sx={{ p: 2.5, border: 1, borderColor: "divider", borderRadius: 3, bgcolor: (t) => alpha(t.palette.primary.main, 0.06) }}>
                    {stripeFailed && (
                      <Typography variant="body2" fontWeight={600} color="warning.main" sx={{ mb: 0.75 }}>
                        The inline card form couldn&apos;t load (often an ad-blocker) — use this instead.
                      </Typography>
                    )}
                    <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                      Pay on Stripe&apos;s secure page
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      You&apos;ll be redirected to Stripe Checkout to complete payment,
                      then brought back to confirm your order.
                    </Typography>
                  </Box>
                )}
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
                      {method === "card"
                        ? `${methods.getValues("nameOnCard") || "Card"} · secured by Stripe`
                        : "Stripe Checkout (redirect)"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            )}

            <Stack direction="row" spacing={1.5} sx={{ mt: 3.5 }}>
              {step > 1 && (
                <Button variant="outlined" size="large" onClick={() => setStep((prev) => prev - 1)} sx={{ height: 48 }}>
                  Back
                </Button>
              )}
              <Button
                type="button"
                variant="contained"
                size="large"
                fullWidth
                disabled={submitting || (step === 4 && method === "card" && !stripe)}
                onClick={handleNext}
                sx={{ height: 48 }}
              >
                {step < 4
                  ? "Continue"
                  : submitting
                    ? "Processing…"
                    : method === "card"
                      ? "Pay & place order"
                      : "Continue to Stripe"}
              </Button>
            </Stack>
          </FormProvider>
        </Box>

        {/* Order summary */}
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, p: 3 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
            Order summary
          </Typography>
          {cart && (
            <Stack spacing={1.25}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" fontWeight={600}>{formatCurrency(cart.summary.subtotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Shipping</Typography>
                <Typography variant="body2" fontWeight={600}>{cart.summary.shipping === 0 ? "Free" : formatCurrency(cart.summary.shipping)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">Tax</Typography>
                <Typography variant="body2" fontWeight={600}>{formatCurrency(cart.summary.tax)}</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={700}>Total</Typography>
                <Typography fontWeight={700}>{formatCurrency(cart.summary.total)}</Typography>
              </Stack>
            </Stack>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default function Checkout() {
  if (!stripePromise) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: "center" }}>
        <Typography variant="h6" fontWeight={700}>
          Payments unavailable
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and restart the app.
        </Typography>
      </Container>
    );
  }
  return (
    <Elements stripe={stripePromise}>
      <CheckoutInner />
    </Elements>
  );
}
