import { Box, Skeleton, useTheme } from "@mui/material";
import { ISkeletonsProps } from "../skeletons.interface";

const SkeletonTable = (props: ISkeletonsProps) => {
  const { length = 4 } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        border: 1,
        borderColor: theme.palette.primary.main,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Skeleton
        variant="rounded"
        width={"100%"}
        height={50}
        sx={{
          bgcolor: theme.palette.primary[400],
          borderBottom: 1,
          borderColor: theme.palette.primary.main,
        }}
      />
      {Array.from({ length })?.map((item: any, id: any) => (
        <Box
          key={item ?? `skeleton+${id}`}
          sx={{
            borderBottom: length - 1 === id ? 0 : 1,
            borderColor: theme.palette.primary.main,
            p: 1,
          }}
        >
          <Skeleton
            animation="wave"
            variant="rounded"
            width={"95%"}
            height={50}
            sx={{
              bgcolor: theme.palette.primary[400],
              margin: "auto",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default SkeletonTable;
