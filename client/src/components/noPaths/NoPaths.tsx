import React from "react";
import { RouteOption } from "../../types/routesData";

type NoPathsProps = {
  paths: RouteOption[] | null;
};

const NoPaths: React.FC<NoPathsProps> = ({ paths }) => {
  if (paths === null) {
    return <h2 className="message">Fill the fields to search routes!</h2>;
  }
  return <h2 className="message">No routes found!</h2>;
};

export default NoPaths;
