import { useState } from "react";

export function useBooleanValue(defaultValue = false) {
  const [value, setValue] = useState<boolean>(defaultValue);

  const setTrueValue = () => {
    setValue(true);
  };

  const setFalseValue = () => {
    setValue(false);
  };

  const toggleValue = () => {
    setValue((prev) => !Boolean(prev));
  };

  return {
    value,
    setFalseValue,
    setTrueValue,
    toggleValue,
  };
}
