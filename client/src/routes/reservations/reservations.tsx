import "./reservations.scss";

const Reservations = () => {
  return (
    <div className="reservations">
      <h2>Reservations</h2>
      <div className="form-wrapper">
        <form>
          <div className="inputs-container">
            <div className="firstname-container input-container">
              <label htmlFor="first-name">First Name</label>
              <input id="first-name" placeholder="John"></input>
            </div>
            <div className="lastname-container input-container">
              <label htmlFor="last-name">Last Name</label>
              <input id="last-name" placeholder="Doe"></input>
            </div>
          </div>
          <button>Search</button>
        </form>
      </div>
    </div>
  );
};
export default Reservations;
