import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material";
import useTanstackTable from "./use-table";
import { StyledTableCell } from "./table.styles";
import { flexRender } from "@tanstack/react-table";
import { ITanstackTableProps } from "./table.interface";
import CustomPagination from "../custom-pagination";
import NoData from "../no-data";
import ApiErrorState from "../api-error-state";
import { PALETTE_MODE } from "@/constants/strings";
import { SkeletonTable } from "../skeletons";

const TanstackTable = <TData,>(props: ITanstackTableProps<TData>) => {
  const {
    columns = [],
    data = [],
    isLoading = false,
    isFetching = false,
    isError = false,
    isSuccess = true,
    isPagination,
    count,
    pageLimit,
    rowsPerPageOptions,
    currentPage,
    totalRecords,
    onPageChange,
    setPage,
    setPageLimit,
    noDataProps,
    apiErrorStateProps,
  } = props;

  const table = useTanstackTable(data, columns);

  const theme = useTheme();

  if (isLoading || isFetching) return <SkeletonTable />;

  return (
    <>
      <TableContainer>
        <Table>
          {!isError && table?.getRowModel()?.rows?.length > 0 && (
            <TableHead sx={{ borderRadius: "10px" }}>
              {table?.getHeaderGroups()?.map((headerGroup: any, index: any) => (
                <TableRow key={index}>
                  {headerGroup?.headers?.map((header: any, index: any) => (
                    <StyledTableCell key={index}>
                      {header?.isPlaceholder
                        ? null
                        : flexRender(
                            header?.column?.columnDef?.header,
                            header?.getContext()
                          )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
          )}

          <TableBody>
            {isSuccess &&
              !isError &&
              table?.getRowModel()?.rows?.map((row: any, rowIndex: number) => (
                <TableRow key={rowIndex}>
                  {row?.getVisibleCells()?.map((cell: any, index: any) => (
                    <StyledTableCell
                      key={index}
                      sx={{
                        bgcolor:
                          rowIndex % 2 !== 0
                            ? theme.palette.mode === PALETTE_MODE.LIGHT
                              ? "grey.50"
                              : "darkShades.900"
                            : "initial",
                      }}
                    >
                      {flexRender(
                        cell?.column?.columnDef?.cell,
                        cell?.getContext()
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {isError ? (
          <ApiErrorState {...apiErrorStateProps} />
        ) : (
          !!!table?.getRowModel()?.rows?.length &&
          isSuccess && <NoData {...noDataProps} />
        )}
      </TableContainer>

      {isPagination && (
        <CustomPagination
          count={count}
          pageLimit={pageLimit}
          rowsPerPageOptions={rowsPerPageOptions}
          currentPage={currentPage}
          totalRecords={totalRecords}
          onPageChange={(page: any) => onPageChange?.(page)}
          setPage={setPage}
          setPageLimit={setPageLimit}
        />
      )}
    </>
  );
};

export default TanstackTable;
