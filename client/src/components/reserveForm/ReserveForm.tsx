import { useState } from "react";
import { RouteOption } from "../../types/routesData";
import Path from "../path/Path";
import "./ReserveForm.scss";
import axios from "axios";
import FormButton from "../formButton/FormButton";

interface ReservePathProps {
  path: RouteOption;
  className: string;
  onClose: (showReserve: boolean) => void;
  handleError: (error: string) => void;
  handleConfirm: (message: string) => void;
}

const ReserveForm: React.FC<ReservePathProps> = ({
  path,
  className,
  onClose,
  handleError,
  handleConfirm,
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleClose = () => {
    onClose(false);
  };

  const handleReservation = async () => {
    const newReservation = {
      firstName,
      lastName,
      path,
    };

    if (firstName === "" || lastName === "") {
      handleError("Please fill in all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:3000/api/reservations",
        newReservation
      );
      handleConfirm("Reservation added successfully");
    } catch (error) {
      console.error("Failed to add reservation:", error);
      handleError("Failed to add reservation");
    }
  };
  return (
    <div className={`reserve-path ${className}`}>
      <div className="reserve-path-heading">
        <h2>Reserve</h2>
        <div className="close" onClick={handleClose}>
          <img src="./closeIcon.svg" alt="Close Icon"></img>
        </div>
      </div>
      <div className="form-wrapper">
        <form>
          <div className="firstname-container input-container">
            <label htmlFor="first-name">First Name</label>
            <input
              id="first-name"
              placeholder="John"
              onChange={(event) => setFirstName(event.target.value)}
            ></input>
          </div>
          <div className="lastname-container input-container">
            <label htmlFor="last-name">Last Name</label>
            <input
              id="last-name"
              placeholder="Doe"
              onChange={(event) => setLastName(event.target.value)}
            ></input>
          </div>
          <FormButton onClick={handleReservation} label="Reserve" />
        </form>
        <Path path={path}></Path>
      </div>
    </div>
  );
};

export default ReserveForm;
