// A comparison function to sort an array of objects by year in descending
// order. Will be used to make sure we get the latest structure data to insert
// into the `Structure` table.
export const byYearDesc = (a, b) => {
  return a["Year"] - b["Year"];
};

// A function to help with database normalization. The source data contains
// pairs such as "County Code" and "County Name", with repeated values
// throughout. This function will extract unique values so they can be placed
// into a separate database table. In some cases, there is no "code" field, such
// as "Material" where materials like "concrete" or "steel" are repeated often.
// In those cases, passing `null` as the `codeKey` argument will cause each
// value to be assigned an incremental number as the code.
export const extractUnique = (data, codeKey, nameKey) => {
  return data.reduce((prev, curr) => {
    const code = codeKey ? curr[codeKey]?.toString() : prev.length.toString();

    const found = prev.find((d) => {
      if (codeKey) return d.code === code;
      return d.name === curr[nameKey];
    });

    if (!found) {
      prev.push({
        code,
        name: curr[nameKey],
      });
    }

    return prev;
  }, []);
};

// Condition ratings are a number between 0 and 9. If the rating is not
// applicable, the rating is `N`. To efficiently store the rating in the
// database, we'll use the integer data type, which cannot be `N`. For that
// reason, we'll convert `N`s to `null`. This function is used later to do that.
export const processConditionRating = (rating) => {
  if (rating === "N") return null;
  return rating;
};
