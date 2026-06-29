import { styled } from "@mui/material/styles";
import { Switch } from "@mui/material";
import { PALETTE_MODE } from "@/constants/strings";

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 24,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 20,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(18px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 3,
    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: theme.palette.common.white,
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 18,
    height: 18,
    borderRadius: "50%",
    transition: "width 200ms ease-in-out",
    color:
      theme.palette.mode === PALETTE_MODE.LIGHT
        ? theme.palette.common.white
        : theme.palette.darkShades.main,
  },
  "& .MuiSwitch-track": {
    borderRadius: 12,
    opacity: 1,
    backgroundColor: theme.palette.grey[400],
    boxSizing: "border-box",
  },
}));
