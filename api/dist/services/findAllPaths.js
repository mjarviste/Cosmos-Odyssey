"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const findAllPaths = (adjacency, from, to) => {
    const allPaths = [];
    function dfs(current, visited, path, totalDistance) {
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
    const visited = new Set([from]);
    dfs(from, visited, [from], 0);
    return allPaths;
};
exports.default = findAllPaths;
//# sourceMappingURL=findAllPaths.js.map