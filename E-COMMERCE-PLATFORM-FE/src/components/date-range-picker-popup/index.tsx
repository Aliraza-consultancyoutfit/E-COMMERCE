"use client";

import { useEffect, useState } from "react";
import { Box, Button, Popover, useMediaQuery, useTheme } from "@mui/material";
import { DateRange, DateRangePicker, RangeKeyDict } from "react-date-range";
import { IDateRangePickerPopupProps } from "./date-range-picker-popup.interface";
import { IDateRange } from "@/interface";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { StyledDateRangePicker } from "./date-range-picker-popup.styles";
import { DATE_RANGE_INITIAL_VALUE } from "@/constants/strings";

const DateRangePickerPopup = (props: IDateRangePickerPopupProps) => {
  const {
    anchorEl,
    onClose,
    onSelect,
    handleCancelBtn = onClose,
    cancelBtnText = "Cancel",
    submitBtnText = "Apply",
    handleSubmitBtn,
    showActionButtons = true,
    initialRange,
  } = props;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectionRange, setSelectionRange] = useState<IDateRange>(
    initialRange || DATE_RANGE_INITIAL_VALUE
  );

  const open = Boolean(anchorEl);

  useEffect(() => {
    if (initialRange) {
      setSelectionRange(initialRange);
    }
  }, [initialRange]);

  const handleSelect = (rangesByKey: RangeKeyDict) => {
    const selection = rangesByKey.selection as IDateRange;
    setSelectionRange(selection);
  };

  const handleApply = () => {
    onSelect(selectionRange);

    if (handleSubmitBtn) {
      handleSubmitBtn();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectionRange(initialRange || DATE_RANGE_INITIAL_VALUE);
    handleCancelBtn();
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      slotProps={{
        paper: {
          style: {
            minWidth: 320,
          },
        },
      }}
    >
      <StyledDateRangePicker>
        {isSmallScreen ? (
          <DateRange
            ranges={[selectionRange]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={1}
          />
        ) : (
          <DateRangePicker
            ranges={[selectionRange]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            months={1}
            inputRanges={[]}
          />
        )}
      </StyledDateRangePicker>

      {showActionButtons && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
            px: 3,
            pb: 2,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Button variant={"outlined"} onClick={handleCancel} size={"small"}>
            {cancelBtnText}
          </Button>
          <Button variant={"contained"} onClick={handleApply} size={"small"}>
            {submitBtnText}
          </Button>
        </Box>
      )}
    </Popover>
  );
};

export default DateRangePickerPopup;
