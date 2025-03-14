import React from "react";

const Button: React.FC<React.ComponentProps<"button">> = ({
    className = "",
    children,
    type = 'button',
    onClick,
    ...props
}) => (
    <button type={type} className={`btn ${className}`} onClick={onClick} {...props}>
        {children}
    </button>
);

export default Button;
