import React from "react";
import { Reservation } from "../../types/routesData";
import "./NoReservations.scss";

type NoReservationsProps = {
  reservations: Reservation[] | null;
};

const NoReservations: React.FC<NoReservationsProps> = ({ reservations }) => {
  if (reservations === null) {
    return (
      <h2 className="message">Type your name to see your reservations!</h2>
    );
  }
  return <h2 className="message">No reservations found!</h2>;
};

export default NoReservations;
