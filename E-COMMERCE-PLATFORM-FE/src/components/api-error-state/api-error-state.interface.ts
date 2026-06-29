import { StaticImageData } from "next/image";
import { ReactNode } from "react";

export interface IApiErrorState {
  height?: string;
  textColor?: string;
  message?: string;
  children?: ReactNode;
  src?: string | StaticImageData;
  sx?: object;
  imgStyle?: object;
  description?: string;
  descriptionColor?: string;
  buttonVisibility?: boolean;
  buttonText?: ReactNode;
  buttonClick?: () => void;
}
