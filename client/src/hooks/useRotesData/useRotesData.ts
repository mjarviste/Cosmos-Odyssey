import axios from "axios";
import { RouteOption } from "../../types/routesData";

const useRotesData = () => {
  const fetchRotesData = async (from: string, to: string, filter: string) => {
    try {
      const data = await axios.get("http://localhost:3000/api/prices", {
        params: {
          from,
          to,
          filter,
        },
      });
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

  return { getRoutesData };
};

export default useRotesData;
