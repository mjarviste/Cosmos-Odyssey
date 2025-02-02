import { useState } from "react";
import "./reservations.scss";
import { Reservation } from "../../types/routesData";
import axios from "axios";
import FormButton from "../../components/formButton/FormButton";
import ReservationInfo from "../../components/reservation/ReservationInfo";
import NoReservations from "../../components/noReservations/NoReservations";
import { Link } from "react-router-dom";
import Error from "../../components/error/Error";
import useErrorHandler from "../../hooks/useErrorHandler/useErrorHandler";

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[] | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const { handleError, error, errorInAnimation } = useErrorHandler();

  const handleSearchReservations = async () => {
    if (firstName === "" || lastName === "") {
      handleError("Please enter your first and last name!");
      return;
    }
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
      <div className="back-wrapper">
        <Link to={"/"}>
          <img src="./backIcon.svg" alt="" />
        </Link>
      </div>
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
          <FormButton onClick={handleSearchReservations} label="Search" />
        </form>
      </div>
      {reservations && reservations.length > 0 ? (
        <div className="reservations-list">
          {reservations.map((reservation, index) => (
            <ReservationInfo
              key={index}
              reservation={reservation}
              index={index}
            />
          ))}
        </div>
      ) : (
        <NoReservations reservations={reservations} />
      )}
      {error && (
        <Error
          message={error}
          className={errorInAnimation ? "inAnimation" : "outAnimation"}
        />
      )}
    </div>
  );
};
export default Reservations;
