import { pxToRem } from "@/utils";

export const styles = {
  tablePaginationStyle: {
    ".MuiTablePagination-select": {
      border: 1,
      borderColor: "text.bodyLight",
      borderRadius: 1,
      color: "text.body",
      height: "20px",
      width: "24px",
      fontWeight: 500,
      fontSize: pxToRem(14),
      marginRight: "-5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    ".MuiTablePagination-selectLabel": {
      fontWeight: 500,
      color: "text.body",
      fontSize: pxToRem(14),
    },

    ".MuiTablePagination-displayedRows": {
      fontWeight: 500,
      marginLeft: "-18px",
      color: "text.body",
      fontSize: pxToRem(14),
    },

    ".MuiTablePagination-actions": {
      display: "none",
    },

    ".MuiTablePagination-selectIcon": {
      color: "text.body",
    },

    ".MuiToolbar-root": {
      padding: 0,
      paddingLeft: 2.5,
    },
  },
};
