import { useState } from "react";

export const useFieldError = (initialText) => {
  const [error, setError] = useState(false);
  const [errorText, setText] = useState("");

  const showError = (value) => {
    setError(value);
    value ? setText(initialText) : setText("");
  };

  return [error, errorText, showError];
};
