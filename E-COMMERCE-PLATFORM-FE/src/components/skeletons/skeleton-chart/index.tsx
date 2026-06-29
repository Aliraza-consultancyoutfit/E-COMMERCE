import { Box, Divider, Skeleton, useTheme } from "@mui/material";

const SkeletonChart = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.6,
      }}
    >
      {/* Chart with Y-axis */}
      <Box sx={{ display: "flex" }}>
        {/* Y-axis labels */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            mr: 2,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              width={30}
              height={18}
              sx={{
                bgcolor: theme.palette.primary[400],
              }}
            />
          ))}
        </Box>

        {/* Chart grid + bars */}
        <Box sx={{ flex: 1, position: "relative", height: 240 }}>
          {/* Horizontal grid lines */}
          {[...Array(6)].map((_, index) => (
            <Box
              key={`h-grid-${index}`}
              sx={{
                position: "absolute",
                top: `${(index / 5) * 100}%`,
                left: 0,
                right: 0,
                height: "1px",
                bgcolor: "divider",
                opacity: 0.3,
              }}
            />
          ))}

          {/* Vertical grid lines */}
          {[...Array(12)].map((_, index) => (
            <Box
              key={`v-grid-${index}`}
              sx={{
                position: "absolute",
                left: `${(index / 11) * 100}%`,
                top: 0,
                bottom: 0,
                width: "1px",
                bgcolor: "divider",
                opacity: 0.3,
              }}
            />
          ))}

          {/* Chart bars */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              px: 1,
            }}
          >
            {[...Array(12)].map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={20}
                height={100 + Math.random() * 100}
                sx={{ borderRadius: 1, bgcolor: theme.palette.primary[400] }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* X-axis labels (outside chart area, aligned with bars) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: 1,
          ml: "42px", // offset so labels line up with bars (y-axis width + margin)
        }}
      >
        {[...Array(12)].map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={20}
            height={16}
            sx={{
              bgcolor: theme.palette.primary[400],
            }}
          />
        ))}
      </Box>

      <Divider />

      {/* Bottom area (legend / controls) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.6,
          flexWrap: "wrap",
        }}
      >
        <Skeleton
          variant="rounded"
          width={100}
          height={40}
          sx={{
            bgcolor: theme.palette.primary[400],
          }}
        />
        <Skeleton
          variant="rounded"
          width={100}
          height={28}
          sx={{
            bgcolor: theme.palette.primary[400],
          }}
        />
      </Box>
    </Box>
  );
};

export default SkeletonChart;
