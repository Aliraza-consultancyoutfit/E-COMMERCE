import { getCoreRowModel, useReactTable } from "@tanstack/react-table";

const useTanstackTable = (data: any, columns: any) => {
  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return table;
};

export default useTanstackTable;
