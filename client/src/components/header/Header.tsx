import { Link } from "react-router-dom";
import "./Header.scss";
import Button from "../button/Button";

const Header = () => {
  return (
    <div className="header">
      <Link to={"/"}>
        <div className="header-logo">
          <img src="./headerLogo.svg" alt="" />
          <span>Cosmos Odyssey</span>
        </div>
      </Link>
      <div className="header-reservations-btn">
        <Link to={"/reservations"}>
          <Button label="My Reservations" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
