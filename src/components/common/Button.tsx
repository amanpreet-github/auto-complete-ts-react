import React from "react";

interface ButtonProps {
    children: React.ReactNode;
}

const Button: React.FC<React.ComponentProps<"button"> & ButtonProps> = ({
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
