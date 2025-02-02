import React from "react";
import { Reservation } from "../../types/routesData";
import "./ReservationInfo.scss";
import { minutesToDays } from "../../services/minutesToDays";

interface ReservationProps {
  reservation: Reservation;
  index: number;
}

const ReservationInfo: React.FC<ReservationProps> = ({
  reservation,
  index,
}) => {
  const filterUnique = (array: string[]) => {
    return array.filter((value, index, self) => self.indexOf(value) === index);
  };
  return (
    <div key={index} className="reservation">
      <div className="reservation-container">
        <h3>Name: {reservation.fullName}</h3>
        <div className="reservation-flights">
          <h4>Route(s):</h4>
          {reservation.flights.map((flight, flightIndex) => (
            <div className="flight" key={flightIndex}>
              <div className="flight-company">
                <span className="label">{flight.providerLeg.companyName}</span>
              </div>
              <div className="flight-details">
                <div className="flight-from">
                  <span className="label">From</span>
                  <span>{flight.providerLeg.from}</span>
                  <span>
                    {new Date(
                      flight.providerLeg.flightStart
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flight-to">
                  <span className="label">To</span>
                  <span>{flight.providerLeg.to}</span>
                  <span>
                    {new Date(
                      flight.providerLeg.flightEnd
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="reservation-info">
          <div className="reservation-info-field">
            <h4>Total Quoted Price:</h4>
            <span>{reservation.totalPrice.toFixed(2) + " €"}</span>
          </div>
          <div className="reservation-info-field">
            <h4>Total Quoted Travel Time:</h4>
            <span>{minutesToDays(reservation.totalTravelTime)}</span>
          </div>
          <div className="reservation-info-field">
            <h4>Transportation Company Name(s):</h4>
            <span>{filterUnique(reservation.companyNames).join(", ")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationInfo;
