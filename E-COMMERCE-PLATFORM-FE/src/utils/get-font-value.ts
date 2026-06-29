import pxToRem from "./px-to-rem";

const responsiveFontSizes = ({
  xs,
  md,
  lg,
}: {
  xs: number;
  md: number;
  lg: number;
}) => ({
  fontSize: pxToRem(lg),
  "@media (min-width: 600px)": {
    fontSize: pxToRem(xs),
  },
  "@media (max-width: 600px)": {
    fontSize: pxToRem(xs),
  },
  "@media (min-width: 900px)": {
    fontSize: pxToRem(md),
  },
  "@media (min-width: 1200px)": {
    fontSize: pxToRem(lg),
  },
});

export default responsiveFontSizes;
