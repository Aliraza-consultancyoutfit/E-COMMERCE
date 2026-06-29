import { CSSProperties, FormEventHandler, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

export interface IFormProviderProps {
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  methods: UseFormReturn<any>;
  style?: CSSProperties;
}
