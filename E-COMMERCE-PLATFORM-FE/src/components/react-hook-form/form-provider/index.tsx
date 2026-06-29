import { FormProvider as Form } from "react-hook-form";
import { IFormProviderProps } from "./form-provider.interface";

export default function FormProvider({
  children,
  onSubmit,
  methods,
  style,
}: IFormProviderProps) {
  return (
    <Form {...methods}>
      <form style={style} onSubmit={onSubmit}>
        {children}
      </form>
    </Form>
  );
}
