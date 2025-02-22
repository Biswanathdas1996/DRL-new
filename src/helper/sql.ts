export const isSqlQuery = (value: string): boolean => {
  const sqlKeywords = [
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "CREATE",
    "DROP",
  ];
  const trimmedValue = value.trim().toUpperCase();
  return sqlKeywords.some((keyword) => trimmedValue.startsWith(keyword));
};
