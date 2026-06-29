import { PALETTE_MODE } from "@/constants/strings";
import { pxToRem } from "@/utils";
import { TableCell, Theme, styled, tableCellClasses } from "@mui/material";

export const StyledTableCell = styled(TableCell)(
  ({ theme }: { theme: Theme }) => ({
    [`&.${tableCellClasses?.head}`]: {
      color: theme.palette.grey[100],
      fontSize: pxToRem(14),
      lineHeight: "18px",
      borderBottom: "none",
      background:
        theme.palette.mode === PALETTE_MODE.LIGHT
          ? theme.palette.grey[50]
          : theme.palette.darkShades[900],
      whiteSpace: "nowrap",
    },

    [`&.${tableCellClasses?.body}`]: {
      fontSize: pxToRem(14),
      color: theme.palette.grey[100],
      borderBottom: "none",
      whiteSpace: "nowrap",
    },
  })
);
