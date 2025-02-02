import axios from "axios";
import { RouteOption } from "../../types/routesData";

const useRotesData = () => {
  const fetchRotesData = async (from: string, to: string, filter: string) => {
    try {
      const data = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/prices`,
        {
          params: {
            from,
            to,
            filter,
          },
        }
      );
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getRoutesData = async (from: string, to: string, filter: string) => {
    try {
      const routesData = await fetchRotesData(from, to, filter);
      const allPaths: RouteOption[] = routesData?.data;
      return allPaths;
    } catch (error) {
      console.error("Error fetching routes:", error);
      return null;
    }
  };

  const getCompanyNames = async () => {
    try {
      const companyNames = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/prices/companies`
      );
      return companyNames;
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  const getPlanetNames = async () => {
    try {
      const planetNames = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/prices/planets`
      );
      return planetNames;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return { getRoutesData, getCompanyNames, getPlanetNames };
};

export default useRotesData;
