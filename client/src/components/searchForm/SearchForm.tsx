import { useState } from "react";
import "./SearchForm.scss";
import FormButton from "../formButton/FormButton";

interface SearchFormProps {
  onSearch: (from: string, to: string, filter: string) => void;
  companyNames?: string[];
  planetNames?: string[];
  handleError: (error: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  companyNames,
  planetNames,
  handleError,
}) => {
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("all");

  const handleSearch = () => {
    if (from === "" || to === "") {
      handleError("Please select both from and to planets");
      return;
    }
    if (from === to) {
      handleError("From and To planets cannot be the same");
      return;
    }
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
            <option value={""}>From Planet</option>
            {planetNames?.map((planetName) => {
              return (
                <option key={planetName} value={planetName}>
                  {planetName}
                </option>
              );
            })}
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
            <option value={""}>To Planet</option>
            {planetNames?.map((planetName) => {
              return (
                <option key={planetName} value={planetName}>
                  {planetName}
                </option>
              );
            })}
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
            {companyNames?.map((companyName) => {
              return (
                <option key={companyName} value={companyName}>
                  {companyName}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <FormButton onClick={handleSearch} label="Search" />
    </form>
  );
};

export default SearchForm;
