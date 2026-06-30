"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import {
  Avatar,
  Box,
  Button,
  Dialog,
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
import { PlusIcon } from "@/assets/icons/common";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import FormProvider from "@/components/react-hook-form/form-provider";
import RHFTextField from "@/components/react-hook-form/rhf-text-field";
import {
  useCreateAdminMutation,
  useGetAdminsQuery,
} from "@/store/team/team.api";
import { getApiErrorMessage } from "@/utils/api-error";

const PAGE_LIMIT = 10;

const initialsOf = (value?: string) =>
  (value || "—")
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("") || "—";

const joinedDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const schema = yup.object({
  name: yup.string().trim().default(""),
  email: yup.string().trim().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "At least 8 characters").required("Password is required"),
});

type InviteValues = yup.InferType<typeof schema>;

function AddAdminDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();
  const methods = useForm<InviteValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await createAdmin({ name: values.name || undefined, email: values.email, password: values.password }).unwrap();
      toast.success("Admin added");
      methods.reset();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
          Add admin
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Create an admin account with full access to this console.
        </Typography>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack spacing={2}>
            <RHFTextField name="name" label="Name" placeholder="Ravi Thomas" />
            <RHFTextField name="email" label="Email" placeholder="ravi@company.com" />
            <RHFTextField name="password" label="Temporary password" type="password" placeholder="At least 8 characters" />
            <Stack direction="row" spacing={1.25} justifyContent="flex-end" sx={{ mt: 1 }}>
              <Button variant="outlined" color="inherit" sx={{ borderColor: "divider" }} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isLoading}>
                {isLoading ? "Adding…" : "Add admin"}
              </Button>
            </Stack>
          </Stack>
        </FormProvider>
      </Box>
    </Dialog>
  );
}

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch, isFetching } = useGetAdminsQuery({ page, limit: PAGE_LIMIT });
  const records = data?.records ?? [];
  const meta = data?.meta;

  return (
    <Box>
      <Stack direction="row" alignItems="center" sx={{ mb: 2.5 }}>
        <Typography variant="body2" color="text.secondary">
          Manage who can access this console.
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusIcon width="18" height="18" />}
          sx={{ ml: "auto" }}
          onClick={() => setDialogOpen(true)}
        >
          Add admin
        </Button>
      </Stack>

      {isLoading ? (
        <Skeleton variant="rounded" height={360} />
      ) : isError ? (
        <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />
      ) : records.length === 0 ? (
        <NoData height="40vh" message="No admins yet" description="Add a team member to get started." buttonVisibility={false} />
      ) : (
        <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden", opacity: isFetching ? 0.6 : 1 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Member</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Joined</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((member) => {
                  const name = member.name || member.email.split("@")[0];
                  return (
                    <TableRow
                      key={member._id}
                      hover
                      sx={{ "&:nth-of-type(even)": { bgcolor: (t) => alpha(t.palette.text.primary, 0.015) } }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1.25}>
                          <Avatar src={member.avatar || undefined} sx={{ width: 34, height: 34, fontSize: 12, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.12) }}>
                            {initialsOf(name)}
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {member.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Box
                          component="span"
                          sx={{ display: "inline-block", px: 1.25, py: 0.4, borderRadius: 999, fontSize: 12, fontWeight: 600, color: "primary.main", bgcolor: (t) => alpha(t.palette.primary.main, 0.14), textTransform: "capitalize" }}
                        >
                          {member.role}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary" }}>{joinedDate(member.createdAt)}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "success.main" }} />
                          <Typography variant="body2" fontWeight={600} color="success.main">
                            Active
                          </Typography>
                        </Stack>
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
      )}

      <AddAdminDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}
