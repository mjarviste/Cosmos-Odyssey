import { useState } from "react";
import { RouteOption } from "../../types/routesData";
import "./Path.scss";

interface PathProps {
  path: RouteOption;
}

const Path: React.FC<PathProps> = ({ path }) => {
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
            <span>{path.totalTravelTime}</span>
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
          <span>{path.totalPrice.toFixed(2)}</span>
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
                    <span className="company-name">{flight.company.name}</span>
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
                  <span>{flight.price}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Path;
