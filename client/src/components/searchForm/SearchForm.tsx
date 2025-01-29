import { useState } from "react";
import "./SearchForm.scss";

interface SearchFormProps {
  onSearch: (from: string, to: string, filter: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const [from, setFrom] = useState<string>("Earth");
  const [to, setTo] = useState<string>("Mars");
  const [companyName, setCompanyName] = useState<string>("all");

  const handleSearch = () => {
    onSearch(from, to, companyName);
  };

  return (
    <form>
      <div className="inputs-container">
        <div className="from-container input-container">
          <label htmlFor="from">From</label>
          <select
            name="from"
            id="from"
            className="from"
            onChange={(event) => setFrom(event.target.value)}
          >
            <option value="Mercury">Mercury</option>
            <option value="Venus">Venus</option>
            <option value="Earth">Earth</option>
            <option value="Mars">Mars</option>
            <option value="Jupiter">Jupiter</option>
            <option value="Saturn">Saturn</option>
            <option value="Uranus">Uranus</option>
            <option value="Neptune">Neptune</option>
          </select>
        </div>
        <div className="to-container input-container">
          <label htmlFor="to">To</label>
          <select
            name="to"
            id="to"
            className="to"
            onChange={(event) => setTo(event.target.value)}
          >
            <option value="Mercury">Mercury</option>
            <option value="Venus">Venus</option>
            <option value="Earth">Earth</option>
            <option value="Mars">Mars</option>
            <option value="Jupiter">Jupiter</option>
            <option value="Saturn">Saturn</option>
            <option value="Uranus">Uranus</option>
            <option value="Neptune">Neptune</option>
          </select>
        </div>
        <div className="company-container input-container">
          <label htmlFor="company">Company</label>
          <select
            id="company"
            name="company"
            onChange={(event) => setCompanyName(event.target.value)}
          >
            <option value="all">All</option>
            <option value="SpaceX">SpaceX</option>
            <option value="Travel Nova">Travel Nova</option>
          </select>
        </div>
      </div>
      <button type="button" onClick={handleSearch}>
        Search
      </button>
    </form>
  );
};

export default SearchForm;
