import React, {
  // ChangeEvent,
  // FocusEvent,
  InputHTMLAttributes,
} from "react";

const Input = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(
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
