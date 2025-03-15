import React, {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
} from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      onChange,
      onBlur,
      className = "",
      name = "",
      autoComplete,
      autoFocus,
      minLength,
      ...props
    },
    ref
  ) => {
    return (
      <input
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        className={className}
        name={name}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        minLength={minLength}
        {...props}
        ref={ref}
      />
    );
  }
);

export default Input;
