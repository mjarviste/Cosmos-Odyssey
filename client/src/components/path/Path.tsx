import { useState } from "react";
import { RouteOption } from "../../types/routesData";
import "./Path.scss";
import Button from "../button/Button";
import { minutesToDays } from "../../services/minutesToDays";

interface PathProps {
  path: RouteOption;
  handleReserve?: (path: RouteOption) => void;
}

const Path: React.FC<PathProps> = ({ path, handleReserve }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <div className="path" onClick={() => setShowDropdown(!showDropdown)}>
      <div className="path-info">
        <div className="path-details">
          <div className="planet-details">
            <span className="planet-name">{path.flights[0].from}</span>
            <span className="planet-flight-time">
              {new Date(path.flights[0].flightStart).toLocaleString()}
            </span>
          </div>
          <div className="path-time">
            <span>{minutesToDays(path.totalTravelTime)}</span>
          </div>
          <div className="planet-details">
            <span className="planet-name">
              {path.flights[path.flights.length - 1].to}
            </span>
            <span className="planet-flight-time">
              {new Date(
                path.flights[path.flights.length - 1].flightEnd
              ).toLocaleString()}
            </span>
          </div>
        </div>
        <div className="path-price">
          <span>{path.totalPrice.toFixed(2)} €</span>
        </div>
      </div>
      {showDropdown ? (
        <div className="path-flights">
          {path.flights.map((flight, index) => {
            return (
              <div className="flight" key={index}>
                <div className="flight-details">
                  <div className="flight-company">
                    <span>Company: </span>
                    <span className="company-name">{flight.companyName}</span>
                  </div>
                  <div className="flight-from-info">
                    <span>{new Date(flight.flightStart).toLocaleString()}</span>
                    <span className="planet-name">{flight.from}</span>
                  </div>
                  <div className="flight-to-info">
                    <span>{new Date(flight.flightEnd).toLocaleString()}</span>
                    <span className="planet-name">{flight.to}</span>
                  </div>
                </div>
                <div className="flight-price">
                  <span>{flight.price} €</span>
                </div>
              </div>
            );
          })}
          {handleReserve && (
            <div className="reserve-container">
              <div className="button-container">
                <Button label="Reserve" onClick={() => handleReserve(path)} />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default Path;
