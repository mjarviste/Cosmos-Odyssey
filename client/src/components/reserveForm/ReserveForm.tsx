import { useState } from "react";
import { RouteOption } from "../../types/routesData";
import Path from "../path/Path";
import "./ReserveForm.scss";
import axios from "axios";

interface ReservePathProps {
  path: RouteOption;
  className: string;
  onClose: (showReserve: boolean) => void;
}

const ReserveForm: React.FC<ReservePathProps> = ({
  path,
  className,
  onClose,
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");


  const handleClose = () => {
    onClose(false);
    console.log(path);
  };

  const handleReservation = async () => {

    const newReservation = {
      firstName,
      lastName,
      path,
    };

    try {
      const reservation = await axios.post("http://localhost:3000/api/reservations", newReservation);
      console.log(reservation);
    }catch (error) {
      console.error("Failed to add reservation:", error);
    }


  }
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
            <input id="first-name" placeholder="John" onChange={(event) => setFirstName(event.target.value)}></input>
          </div>
          <div className="lastname-container input-container">
            <label htmlFor="last-name">Last Name</label>
            <input id="last-name" placeholder="Doe" onChange={(event) => setLastName(event.target.value)}></input>
          </div>
          <button type="button" onClick={handleReservation}>Reserve</button>
        </form>
        <Path path={path}></Path>
      </div>
    </div>
  );
};

export default ReserveForm;
