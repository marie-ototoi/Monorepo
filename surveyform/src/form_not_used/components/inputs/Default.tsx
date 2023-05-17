"use client";
import { FormInputProps } from "@devographics/react-form";
import FormControl from "react-bootstrap/FormControl";

import { FormItem } from "~/form_not_used/components/elements/FormItem";

export const FormComponentText = ({
  path,
  label,
  refFunction,
  inputProperties = {},
  itemProperties = {},
}: FormInputProps & any) => {
  return (
    <FormItem path={path} label={label} {...itemProperties}>
      {/** @ts-ignore the "as" prop is problematic */}
      <FormControl {...inputProperties} ref={refFunction} type="text" />
    </FormItem>
  );
};

export default FormComponentText;