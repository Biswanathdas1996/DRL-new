import filterData from "../string/filter.json";

export const useQueryFilter = (query: string) => {
  let filteredQuery = query;
  filterData.forEach((filter) => {
    const regex = new RegExp(filter.find, "gi");
    if (regex.test(query)) {
      filteredQuery = filteredQuery.replace(regex, filter.replace);
    }
  });
  return filteredQuery;
};
