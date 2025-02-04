import filterData from "../string/filter.json";

export const useQueryFilter = (query: string) => {
  let filteredQuery = query;
  filterData.forEach((filter) => {
    if (query.includes(filter.find)) {
      filteredQuery = filteredQuery.replace(filter.find, filter.replace);
    }
  });
  return filteredQuery;
};
