import { useEffect, useState } from "react";
import "./TransportationApp.scss";
import useRotesData from "../../hooks/useRotesData/useRotesData";
import { RouteOption } from "../../types/routesData";
import Path from "../../components/path/Path";
import SearchForm from "../../components/searchForm/SearchForm";
import ReserveForm from "../../components/reserveForm/ReserveForm";

const TransportationApp = () => {
  const { getRoutesData } = useRotesData();
  const [allPaths, setAllPaths] = useState<RouteOption[]>([]);
  const [showReserve, setShowReserve] = useState<boolean>(false);
  const [chosenPath, setChosenPath] = useState<RouteOption | null>(null);

  const handleFormSubmit = async (
    from: string,
    to: string,
    companyId: string
  ) => {
    const result = await getRoutesData(from, to, companyId);
    console.log(result);
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

  const handleReserveClose = (close: boolean) => {
    setShowReserve(close);
  };

  const handleReserve = (path: RouteOption) => {
    setChosenPath(path);
    setShowReserve(true);
  };

  return (
    <div className="transportation-app">
      <div className={showReserve ? "main-search hidden" : "main-search"}>
        <SearchForm onSearch={handleFormSubmit} />
      </div>
      <div className={showReserve ? "all-paths hidden" : "all-paths"}>
        <select onChange={(event) => handleFilterChange(event.target.value)}>
          <option value="none">Filter</option>
          <option value="totalPrice">Cheapest First</option>
          <option value="totalTravelTime">Fastest First</option>
        </select>
        {allPaths.length > 0 ? (
          allPaths.map((path, index) => {
            return (
              <div className="path-container" key={index}>
                <Path path={path} />
                <button onClick={() => handleReserve(path)}>Reserve</button>
              </div>
            );
          })
        ) : (
          <p>Loading...</p>
        )}
      </div>
      {chosenPath && (
        <ReserveForm
          path={chosenPath}
          className={showReserve ? "active" : ""}
          onClose={handleReserveClose}
        ></ReserveForm>
      )}
    </div>
  );
};

export default TransportationApp;
