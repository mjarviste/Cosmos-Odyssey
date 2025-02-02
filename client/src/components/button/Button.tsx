import React from "react";
import "./Button.scss";

interface ButtonProps {
  onClick?: () => void;
  label: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  disabled = false,
}) => {
  return (
    <button onClick={onClick} disabled={disabled} className="custom-button">
      {label}
    </button>
  );
};

export default Button;
