"use client";

import toast from "react-hot-toast";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import ApiErrorState from "@/components/api-error-state";
import NoData from "@/components/no-data";
import {
  NotificationIcon,
  ShoppingCartIcon,
  TrendIcon,
} from "@/assets/icons/common";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "@/store/notifications/notifications.api";
import type { NotificationType } from "@/store/notifications/notifications.types";
import { getApiErrorMessage } from "@/utils/api-error";

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  order: <ShoppingCartIcon width="18" height="18" stroke="currentColor" />,
  promo: <TrendIcon width="18" height="18" stroke="currentColor" />,
  system: <NotificationIcon width="18" height="18" stroke="currentColor" />,
};

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const relativeTime = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < MINUTE) {
    return "Just now";
  }
  if (diff < HOUR) {
    return `${Math.floor(diff / MINUTE)}m ago`;
  }
  if (diff < DAY) {
    return `${Math.floor(diff / HOUR)}h ago`;
  }
  if (diff < 7 * DAY) {
    return `${Math.floor(diff / DAY)}d ago`;
  }
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

export default function NotificationsPanel() {
  const { data: notifications, isLoading, isError, refetch } =
    useGetNotificationsQuery();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead, { isLoading: markingAll }] =
    useMarkAllNotificationsReadMutation();

  const hasUnread = notifications?.some((item) => !item.read) ?? false;

  const handleMarkAll = async () => {
    try {
      await markAllRead().unwrap();
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleRowClick = async (id: string, read: boolean) => {
    if (read) {
      return;
    }
    try {
      await markRead(id).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const Header = (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      flexWrap="wrap"
      spacing={1.5}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Notifications
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Order updates, offers, and account alerts.
        </Typography>
      </Box>
      <Button variant="outlined" disabled={!hasUnread || markingAll} onClick={handleMarkAll}>
        Mark all as read
      </Button>
    </Stack>
  );

  if (isLoading) {
    return (
      <Box>
        {Header}
        <Stack spacing={1.5}>
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} variant="rounded" height={72} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (isError) {
    return (
      <Box>
        {Header}
        <ApiErrorState
          height="40vh"
          buttonText="Try again"
          buttonClick={() => refetch()}
        />
      </Box>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Box>
        {Header}
        <NoData
          height="40vh"
          message="You're all caught up"
          description="New notifications will show up here."
          buttonVisibility={false}
        />
      </Box>
    );
  }

  return (
    <Box>
      {Header}
      <Box sx={{ border: 1, borderColor: "divider", borderRadius: 4, overflow: "hidden" }}>
        {notifications.map((item, index) => (
          <Stack
            key={item._id}
            direction="row"
            spacing={2}
            alignItems="flex-start"
            onClick={() => handleRowClick(item._id, item.read)}
            sx={{
              p: 2.25,
              cursor: item.read ? "default" : "pointer",
              borderBottom: index < notifications.length - 1 ? 1 : 0,
              borderColor: "divider",
              bgcolor: item.read
                ? "transparent"
                : (theme) => alpha(theme.palette.primary.main, 0.06),
              "&:hover": item.read
                ? undefined
                : { bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1) },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
              }}
            >
              {TYPE_ICON[item.type]}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontWeight={item.read ? 500 : 700} noWrap>
                  {item.title}
                </Typography>
                {!item.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      flexShrink: 0,
                      bgcolor: "primary.main",
                    }}
                  />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                {item.body}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.75 }}>
                {relativeTime(item.createdAt)}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Box>
    </Box>
  );
}
