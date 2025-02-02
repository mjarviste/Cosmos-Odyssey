import React from "react";
import "./FormButton.scss";

interface FormButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

const FormButton: React.FC<FormButtonProps> = ({
  onClick,
  label,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="form-button"
    >
      {label}
    </button>
  );
};

export default FormButton;
