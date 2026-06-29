"use client";

import { ReactNode } from "react";
import { Box, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import { useGetActivityQuery } from "@/store/activity/activity.api";
import type { ActivityType } from "@/store/activity/activity.api";

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ICONS: Record<ActivityType, ReactNode> = {
  order: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  product: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
    </svg>
  ),
  customer: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  admin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
};

const TONE: Record<ActivityType, "success" | "primary" | "warning"> = {
  order: "success",
  product: "primary",
  customer: "warning",
  admin: "primary",
};

export default function AdminActivityLogs() {
  const { data, isLoading, isError, refetch } = useGetActivityQuery();

  if (isLoading) {
    return <Skeleton variant="rounded" height={420} />;
  }
  if (isError) {
    return <ApiErrorState height="40vh" buttonText="Try again" buttonClick={() => refetch()} />;
  }

  const events = data ?? [];

  return (
    <Box sx={{ maxWidth: 760 }}>
      <Box
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 4,
          p: 3,
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100vh - 160px)",
        }}
      >
        <Typography fontWeight={700} sx={{ mb: 2.5, flexShrink: 0 }}>
          Recent activity
        </Typography>

        {events.length === 0 ? (
          <NoData height="220px" message="No activity yet" description="Store activity appears here as it happens." buttonVisibility={false} imgStyle={{ maxWidth: "150px" }} />
        ) : (
          <Stack sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
            {events.map((event, index) => {
              const tone = TONE[event.type];
              const isLast = index === events.length - 1;
              return (
                <Stack key={event.id} direction="row" spacing={1.75} sx={{ position: "relative", pb: isLast ? 0 : 2.5 }}>
                  {!isLast && (
                    <Box sx={{ position: "absolute", left: 17, top: 38, bottom: 0, width: 2, bgcolor: "divider" }} />
                  )}
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2.5,
                      flexShrink: 0,
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: `${tone}.main`,
                      bgcolor: (t) => alpha(t.palette[tone].main, 0.14),
                    }}
                  >
                    {ICONS[event.type]}
                  </Box>
                  <Box sx={{ pt: 0.5 }}>
                    <Typography variant="body2">
                      {event.actor && <Box component="span" sx={{ fontWeight: 600 }}>{event.actor} </Box>}
                      {event.action}
                      {event.target && <Box component="span" sx={{ fontWeight: 600 }}> {event.target}</Box>}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                      {relativeTime(event.createdAt)}
                    </Typography>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
