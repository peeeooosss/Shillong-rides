import { useMemo } from "react";

/** Filter demo fleet by category + free-text query. */
export function useFilteredVehicles(vehicles, category, query) {
  return useMemo(
    () =>
      vehicles.filter(
        (v) =>
          (category === "All" || v.category === category) &&
          `${v.name} ${v.type} ${v.category}`.toLowerCase().includes(query.toLowerCase())
      ),
    [vehicles, category, query]
  );
}
