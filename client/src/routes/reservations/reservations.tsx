import { useState } from "react";
import "./reservations.scss";
import { Reservation } from "../../types/routesData";
import axios from "axios";

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleSearchReservations = async () => {
    try {
      const reservations = await axios.get(
        "http://localhost:3000/api/reservations",
        {
          params: {
            firstName,
            lastName,
          },
        }
      );
      setReservations(reservations.data);
    } catch (error) {
      console.error("Failed to search reservations:", error);
    }
  };

  return (
    <div className="reservations">
      <h2>Reservations</h2>
      <div className="form-wrapper">
        <form>
          <div className="inputs-container">
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
          </div>
          <button type="button" onClick={handleSearchReservations}>
            Search
          </button>
        </form>
      </div>
      {reservations.length > 0 && (
        <div className="reservations-list">
          {reservations.map((reservation, index) => (
            <div key={index} className="reservation">
              <h3>{reservation.fullName}</h3>
              <p>
                Valid Until:{" "}
                {new Date(reservation.validUntil).toLocaleDateString()}
              </p>
              <p>Companies: {reservation.companyNames.join(", ")}</p>
              <div>
                Route:{" "}
                {reservation.flights.map((flight) => {
                  return (
                    <div>
                      {flight.providerLeg.from} - {flight.providerLeg.to}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Reservations;
