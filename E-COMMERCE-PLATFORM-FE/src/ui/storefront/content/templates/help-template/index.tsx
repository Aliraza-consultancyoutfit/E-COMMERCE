"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  InputBase,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { ExpandMoreIcon } from "@/assets/icons/common";
import NoData from "@/components/no-data";
import { PATHS } from "@/constants/routes";

interface IFaq {
  question: string;
  answer: string;
}

const FAQS: IFaq[] = [
  {
    question: "How do I track my order?",
    answer:
      "Once your order ships, you'll receive an email with a tracking link. You can also view live status anytime from your account under Orders.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer 30-day, no-questions-asked returns on most items. Products must be in their original condition. Start a return from the Orders page in your account.",
  },
  {
    question: "When will I be charged?",
    answer:
      "Your card is authorized at checkout and charged when your order is confirmed. You'll see the full breakdown — items, shipping, and tax — before you pay.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "We currently ship across the United States, with select international destinations added regularly. Available regions are shown at checkout based on your address.",
  },
  {
    question: "How do I change my shipping address?",
    answer:
      "You can update your address before an order ships from the Orders page. After it ships, contact support and we'll do our best to reroute it.",
  },
];

export default function HelpTemplate() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return FAQS;
    return FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );
  }, [query]);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ textAlign: "center", maxWidth: 560, mx: "auto" }}>
        <Typography
          component="h1"
          variant="h2"
          fontWeight={700}
          sx={{ letterSpacing: "-0.02em", lineHeight: 1.15 }}
        >
          How can we help?
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 2, fontSize: 17, lineHeight: 1.6 }}>
          Search our most common questions, or reach out and we&apos;ll point
          you in the right direction.
        </Typography>
        <InputBase
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search help articles…"
          inputProps={{ "aria-label": "Search help articles" }}
          sx={{
            mt: 3,
            width: "100%",
            maxWidth: 440,
            height: 48,
            px: 2,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        />
      </Box>

      <Box sx={{ mt: 5 }}>
        {filtered.length === 0 ? (
          <NoData
            height="30vh"
            message="No matching articles"
            description="Try a different search term, or contact our support team below."
            src=""
            buttonVisibility={false}
          />
        ) : (
          <Stack spacing={1.5}>
            {filtered.map((faq) => (
              <Accordion
                key={faq.question}
                disableGutters
                elevation={0}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  "&:before": { display: "none" },
                  "&.MuiAccordion-root": { borderRadius: 3 },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon width="18" height="18" stroke="currentColor" />}
                >
                  <Typography fontWeight={600}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          mt: 5,
          p: { xs: 3, md: 4 },
          textAlign: "center",
          borderRadius: 4.5,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Still need help?
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>
          Our support team is happy to assist with anything we didn&apos;t cover.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push(PATHS.content.contact)}
          sx={{ height: 48, px: 4 }}
        >
          Contact support
        </Button>
      </Box>
    </Container>
  );
}
