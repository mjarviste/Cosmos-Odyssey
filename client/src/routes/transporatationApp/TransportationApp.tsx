import { useState } from "react";
import "./TransportationApp.scss";
import useRotesData from "../../hooks/useRotesData/useRotesData";
import { RouteOption } from "../../types/routesData";
import Path from "../../components/path/Path";
import SearchForm from "../../components/searchForm/SearchForm";
import Header from "../../components/header/Header";

const TransportationApp = () => {
  const { getRoutesData } = useRotesData();
  const [allPaths, setAllPaths] = useState<RouteOption[]>([]);

  const handleFormSubmit = async (
    from: string,
    to: string,
    companyId: string
  ) => {
    const result = await getRoutesData(from, to, companyId);
    setAllPaths(result || []);
  };

  const handleFilterChange = async (filterValue: string) => {
    if (allPaths.length > 0) {
      if (filterValue === "totalPrice") {
        setAllPaths((paths) => [
          ...paths.sort((a, b) => a.totalPrice - b.totalPrice),
        ]);
      } else {
        setAllPaths((paths) => [
          ...paths.sort((a, b) => a.totalTravelTime - b.totalTravelTime),
        ]);
      }
    }
  };

  return (
    <div className="transportation-app">
      <div className="main-search">
        <SearchForm onSearch={handleFormSubmit} />
      </div>
      <div className="allPaths">
        <select onChange={(event) => handleFilterChange(event.target.value)}>
          <option value="none">Filter</option>
          <option value="totalPrice">Cheapest First</option>
          <option value="totalTravelTime">Fastest First</option>
        </select>
        {allPaths.length > 0 ? (
          allPaths.map((path, index) => {
            return <Path key={index} path={path} />;
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default TransportationApp;
