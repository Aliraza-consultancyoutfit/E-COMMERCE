export interface ICustomPaginationProps {
  count?: number;
  rowsPerPageOptions?: number[];
  pageLimit?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  setPage?: (page: number) => void;
  setPageLimit?: (limit: number) => void;
  totalRecords?: number;
}
