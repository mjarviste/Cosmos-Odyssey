import { AdjacencyList } from "./buildAdjacencyList";
import { RoutePath } from "../types/routesData";

const findAllPaths = (
  adjacency: AdjacencyList,
  from: string,
  to: string
): Array<RoutePath> => {
  const allPaths: RoutePath[] = [];

  function dfs(
    current: string,
    visited: Set<string>,
    path: string[],
    totalDistance: number
  ) {
    if (current === to) {
      allPaths.push({ path: [...path], totalDistance });
      return;
    }
    const neighbors = adjacency[current] || [];
    for (const edge of neighbors) {
      const next = edge.to;
      if (!visited.has(next)) {
        visited.add(next);
        path.push(next);

        dfs(next, visited, path, totalDistance + edge.distance);

        path.pop();
        visited.delete(next);
      }
    }
  }

  const visited = new Set<string>([from]);
  dfs(from, visited, [from], 0);

  return allPaths;
};

export default findAllPaths;
