"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Pagination,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import { PATHS } from "@/constants/routes";
import { useGetCustomersQuery } from "@/store/customers/customers.api";
import type { CustomerListItem } from "@/store/customers/customers.types";
import { formatCurrency } from "@/utils/format";

const PAGE_LIMIT = 10;

const initialsOf = (value?: string) =>
  (value || "—")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "—";

/** Derive a segment tag from spend / order count. */
const segmentOf = (customer: CustomerListItem) => {
  if (customer.spent >= 1000) return { label: "VIP", color: "primary" as const };
  if (customer.orderCount <= 1) return { label: "New", color: "warning" as const };
  return { label: "Active", color: "success" as const };
};

function SegmentTag({ customer }: { customer: CustomerListItem }) {
  const seg = segmentOf(customer);
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 1.25,
        py: 0.4,
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color: `${seg.color}.main`,
        bgcolor: (t) => alpha(t.palette[seg.color].main, 0.14),
      }}
    >
      {seg.label}
    </Box>
  );
}

export default function AdminCustomers() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useGetCustomersQuery({
    page,
    limit: PAGE_LIMIT,
  });
  const records = data?.records ?? [];
  const meta = data?.meta;

  if (isLoading) {
    return <Skeleton variant="rounded" height={420} />;
  }
  if (isError) {
    return <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />;
  }
  if (records.length === 0) {
    return <NoData height="40vh" message="No customers yet" description="Customers appear here once shoppers sign up." buttonVisibility={false} />;
  }

  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden", opacity: isFetching ? 0.6 : 1 }}>
      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "background.default" }}>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Segment</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Orders</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary" }}>Spent</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((customer) => {
              const name = customer.name || customer.email.split("@")[0];
              return (
                <TableRow
                  key={customer._id}
                  hover
                  sx={{ "&:nth-of-type(even)": { bgcolor: (t) => alpha(t.palette.text.primary, 0.015) } }}
                >
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                      <Avatar src={customer.avatar || undefined} sx={{ width: 34, height: 34, fontSize: 12, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }}>
                        {initialsOf(name)}
                      </Avatar>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                          {name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {customer.email}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell><SegmentTag customer={customer} /></TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{customer.orderCount}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(customer.spent)}</TableCell>
                  <TableCell align="right">
                    <Button variant="outlined" color="inherit" size="small" sx={{ borderColor: "divider" }} onClick={() => router.push(PATHS.admin.customer(customer._id))}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {meta && meta.pages > 1 && (
        <Stack alignItems="center" sx={{ py: 2, borderTop: 1, borderColor: "divider" }}>
          <Pagination count={meta.pages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
        </Stack>
      )}
    </Box>
  );
}
