import "./Error.scss";
import React from "react";

interface ErrorProps {
  message: string;
  className?: string;
}

const Error: React.FC<ErrorProps> = ({ message, className }) => {
  return (
    <div className={`error-component ${className}`}>
      <img src="./errorIcon.svg" alt="error" />
      <p>{message}</p>
    </div>
  );
};

export default Error;
