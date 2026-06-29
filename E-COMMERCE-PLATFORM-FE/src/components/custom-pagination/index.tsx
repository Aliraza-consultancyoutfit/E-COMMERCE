import {
  Box,
  IconButton,
  Pagination,
  TablePagination,
  Theme,
  useTheme,
} from "@mui/material";
import { ICustomPaginationProps } from "./custom-pagination.interface";
import { styles } from "./custom-pagination.style";
import { pxToRem } from "@/utils";
import { ArrowIcon } from "@/assets/icons/common";

const CustomPagination = (props: ICustomPaginationProps) => {
  const {
    count = 1,
    rowsPerPageOptions = [5, 10, 15, 20],
    pageLimit = 10,
    currentPage = 1,
    onPageChange,
    setPage,
    setPageLimit,
    totalRecords = 0,
  } = props;

  const theme = useTheme<Theme>();

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      flexWrap={"wrap"}
      gap={2}
      mt={2}
    >
      <TablePagination
        component="div"
        count={totalRecords}
        page={currentPage - 1}
        onPageChange={(_, page) => {
          if (onPageChange) {
            onPageChange(page);
          }
        }}
        rowsPerPage={pageLimit}
        onRowsPerPageChange={(event) => {
          const newPageLimit = parseInt(event.target.value, 10);
          const newPage =
            Math.floor(((currentPage - 1) * pageLimit) / newPageLimit) + 1;

          if (setPageLimit) {
            setPageLimit(newPageLimit);
          }
          if (setPage) {
            setPage(newPage);
          }
        }}
        rowsPerPageOptions={rowsPerPageOptions}
        sx={styles.tablePaginationStyle}
      />

      <Box
        display={"flex"}
        border={"1px solid"}
        borderColor={"text.bodyLight"}
        borderRadius={2}
      >
        {currentPage > 1 && (
          <IconButton
            onClick={() => {
              if (setPage) {
                setPage(currentPage - 1);
              }
            }}
          >
            <ArrowIcon />
          </IconButton>
        )}

        <Pagination
          count={count}
          page={currentPage}
          boundaryCount={1}
          siblingCount={0}
          onChange={(_, page) => {
            if (onPageChange) {
              onPageChange(page);
            }
          }}
          hidePrevButton
          hideNextButton
          sx={{
            ".MuiPaginationItem-root": {
              width: 40,
              height: 40,
              borderRadius: 0,
              fontSize: pxToRem(14),
              color: "grey.50",
              backgroundColor: `${theme.palette.primary.main} !important`,
            },
          }}
        />

        {currentPage < count && (
          <IconButton
            onClick={() => {
              if (setPage) {
                setPage(currentPage + 1);
              }
            }}
          >
            <ArrowIcon sx={{ transform: "rotate(180deg)" }} />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default CustomPagination;
