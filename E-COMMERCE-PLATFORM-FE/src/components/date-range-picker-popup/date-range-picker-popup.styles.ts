import { PALETTE_MODE } from "@/constants/strings";
import { pxToRem } from "@/utils";
import { styled } from "@mui/material";

export const StyledDateRangePicker = styled("div")(({ theme }) => ({
  // Full Date Range Picker
  "& .rdrCalendarWrapper": {
    background: theme.palette.background.paper,
  },
  // Header Date Range Fields
  "& .rdrDateDisplayWrapper": {
    background: theme.palette.background.paper,
    "& .rdrDateDisplay": {
      marginBottom: 0,
    },
  },
  "& .rdrDateDisplayItem input": {
    fontSize: pxToRem(14),
    borderRadius: 3,
    borderColor:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.common.stroke
        : theme.palette.darkShades[700],
    color:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.grey[200]
        : theme.palette.grey[100],
    backgroundColor:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.grey[900]
        : theme.palette.darkShades[800],
  },
  "& .rdrDateDisplayItemActive": { borderColor: "theme.palette.primary.main" },

  // Month, Year and Arrows
  "& .rdrMonthAndYearWrapper": { paddingTop: 0 },
  "& .rdrMonthAndYearPickers select": {
    color: theme.palette.primary.main,
    background: theme.palette.primary[100],
    fontSize: pxToRem(14),
  },
  "& .rdrNextPrevButton": {
    background: theme.palette.primary[100],
  },
  "& .rdrPprevButton": {
    i: {
      borderColor: `transparent ${theme.palette.primary.main} transparent transparent`,
    },
  },
  "& .rdrNextButton": {
    i: {
      borderColor: `transparent transparent transparent ${theme.palette.primary.main}`,
    },
  },

  // Calendar Body
  "& .rdrWeekDay": {
    color:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.grey[200]
        : theme.palette.grey[100],
  },
  "& .rdrDayPassive span span": {
    color:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.grey[600]
        : theme.palette.divider,
  },
  "& .rdrDayNumber span": {
    color:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.grey[200]
        : theme.palette.grey[100],
  },
  // Start and end edges of the selection
  "& .rdrStartEdge, & .rdrEndEdge": {
    background: theme.palette.primary.main,
  },
  // Days in the selected range
  "& .rdrInRange": {
    background: theme.palette.primary.main,
  },
  // Day selection background
  "& .rdrDayToday .rdrDayNumber span:after": {
    background: theme.palette.primary.main, // Change the "today" indicator color
  },
  // Additional styles to remove any remaining borders
  "& .rdrDayStartPreview, & .rdrDayInPreview, & .rdrDayEndPreview": {
    borderColor: `${theme.palette.primary[800]} !important`,
  },

  // Left Side Range
  "& .rdrStaticRange": {
    color:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.grey[200]
        : theme.palette.grey[100],
    fontSize: pxToRem(14),
    background: "transparent",
  },
  "& .rdrStaticRangeSelected": {
    span: { color: theme.palette.primary.main },
  },
  "& .rdrDefinedRangesWrapper": {
    background: theme.palette.background.paper,
  },
}));
