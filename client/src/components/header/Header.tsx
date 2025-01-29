import { Link } from "react-router-dom";
import "./Header.scss";

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
          <button>My Reservations</button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
