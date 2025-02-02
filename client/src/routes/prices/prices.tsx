import { useEffect, useState } from "react";

import "./prices.scss";

import useRotesData from "../../hooks/useRotesData/useRotesData";

import Path from "../../components/path/Path";
import SearchForm from "../../components/searchForm/SearchForm";
import ReserveForm from "../../components/reserveForm/ReserveForm";
import NoPaths from "../../components/noPaths/NoPaths";

import { RouteOption } from "../../types/routesData";
import useErrorHandler from "../../hooks/useErrorHandler/useErrorHandler";
import Error from "../../components/error/Error";
import Confirm from "../../components/confirm/Confirm";
import useConfirmHandler from "../../hooks/useConfirmHandler/useConfirmHandler";

const Prices = () => {
  const { getRoutesData, getCompanyNames, getPlanetNames } = useRotesData();
  const { handleError, error, errorInAnimation } = useErrorHandler();
  const { handleConfirm, confirm, confirmInAnimation } = useConfirmHandler();
  const [allPaths, setAllPaths] = useState<RouteOption[] | null>(null);
  const [showReserve, setShowReserve] = useState<boolean>(false);
  const [chosenPath, setChosenPath] = useState<RouteOption | null>(null);
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [planetNames, setPlanetNames] = useState<string[]>([]);

  useEffect(() => {
    const getPlanetsAndCompanies = async () => {
      const planets = await getPlanetNames();
      if (planets) {
        const allPlanetNames = planets.data;
        setPlanetNames(allPlanetNames);
      }
      const companies = await getCompanyNames();
      if (companies) {
        const allCompanyNames = companies.data;
        setCompanyNames(allCompanyNames);
      }
    };
    getPlanetsAndCompanies();
  }, []);

  const handleFormSubmit = async (
    from: string,
    to: string,
    companyId: string
  ) => {
    const result = await getRoutesData(from, to, companyId);
    setAllPaths(result || []);
  };

  const handleFilterChange = async (filterValue: string) => {
    if (allPaths && allPaths.length > 0) {
      if (filterValue === "totalPrice") {
        setAllPaths((paths) => [
          ...(paths ? paths.sort((a, b) => a.totalPrice - b.totalPrice) : []),
        ]);
      } else {
        setAllPaths((paths) => [
          ...(paths
            ? paths.sort((a, b) => a.totalTravelTime - b.totalTravelTime)
            : []),
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
    <div className="prices">
      <div className={showReserve ? "main-search hidden" : "main-search"}>
        <SearchForm
          onSearch={handleFormSubmit}
          companyNames={companyNames}
          planetNames={planetNames}
          handleError={handleError}
        />
      </div>
      <div className={showReserve ? "all-paths hidden" : "all-paths"}>
        {allPaths && allPaths.length > 0 ? (
          <div className="all-paths-container">
            <select
              onChange={(event) => handleFilterChange(event.target.value)}
            >
              <option value="none">Sort</option>
              <option value="totalPrice">Cheapest First</option>
              <option value="totalTravelTime">Fastest First</option>
            </select>
            {allPaths.map((path, index) => {
              return (
                <div className="path-container" key={index}>
                  <Path path={path} handleReserve={handleReserve} />
                </div>
              );
            })}
          </div>
        ) : (
          <NoPaths paths={allPaths} />
        )}
      </div>
      {chosenPath && (
        <ReserveForm
          path={chosenPath}
          className={showReserve ? "active" : ""}
          onClose={handleReserveClose}
          handleError={handleError}
          handleConfirm={handleConfirm}
        ></ReserveForm>
      )}
      {error && (
        <Error
          message={error}
          className={errorInAnimation ? "inAnimation" : "outAnimation"}
        />
      )}
      {confirm && (
        <Confirm
          message={confirm}
          className={confirmInAnimation ? "inAnimation" : "outAnimation"}
        />
      )}
    </div>
  );
};

export default Prices;
