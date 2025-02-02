import "./Confirm.scss";
import React from "react";

interface ConfirmProps {
  message: string;
  className?: string;
}

const Confirm: React.FC<ConfirmProps> = ({ message, className }) => {
  return (
    <div className={`confirm-component ${className}`}>
      <img src="./confirmIcon.svg" alt="confirm" />
      <p>{message}</p>
    </div>
  );
};

export default Confirm;
