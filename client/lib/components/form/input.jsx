import { Input as MTInput } from "@material-tailwind/react";
import {useController} from "react-hook-form";

/**
 * Returns controlled input element. For uncontrolled one, import Input from "@material-tailwind/react" instead.
 */
export default function Input({name, control, defaultValue, required, ...rest}) {
  const {field} = useController({
    name,
    control,
    defaultValue,
    rules: {required},
  });

  return <MTInput
    onChange={field.onChange} // send value to hook form
    onBlur={field.onBlur} // notify when input is touched/blur
    value={field.value} // input value
    name={field.name} // send down the input name
    inputRef={field.ref} // send input ref, so we can focus on input when error appear
    required={required}
    {...rest}
  />;
}
