import { Box, Grid2, Skeleton, useTheme } from "@mui/material";
import { ISkeletonsProps } from "../skeletons.interface";

const SkeletonForm = (props: ISkeletonsProps) => {
  const { length = 4, gridSize = { xs: 12, md: 6 } } = props;
  const theme = useTheme();

  return (
    <Grid2 container spacing={2.4}>
      {Array?.from({ length })?.map((item: any, id: any) => (
        <Grid2 key={item ?? `skeleton+${id}`} size={gridSize}>
          <Skeleton
            animation={"wave"}
            variant={"rounded"}
            height={20}
            sx={{
              bgcolor: theme.palette.primary[400],
              width: { xs: "100%", md: "30%" },
            }}
          />
          <Box
            sx={{
              border: 1,
              borderColor: theme.palette.primary.main,
              p: 1,
              mt: 0.5,
              borderRadius: 3,
            }}
          >
            <Skeleton
              animation={"wave"}
              variant={"rounded"}
              width={"100%"}
              height={30}
              sx={{
                bgcolor: theme.palette.primary[400],
              }}
            />
          </Box>
        </Grid2>
      ))}
    </Grid2>
  );
};

export default SkeletonForm;
