// Import functions and objects from Node.js, 3rd party libraries, and our own
// external code
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import papaparse from "papaparse";
import { db } from "./db.js";

// Useful to create filepaths relative to this file
const __dirname = fileURLToPath(new URL(".", import.meta.url));

// Read in the source data (from public dataset) to a UTF-8 string
const sourceString = await readFile(
  join(__dirname, "../source-data/BridgesExport_AllYear.csv"),
  "utf-8",
);

// Parse the source data string with PapaParse. Leverage the library's ability
// to dynamically detect data types (we'll have to modify some manually further
// later in this file, though).
const parsed = papaparse.parse(sourceString, {
  header: true,
  dynamicTyping: true,
});

// Stop if there were any errors parsing the source data
if (parsed.errors.length > 0) {
  console.error(parsed.errors);
  process.exit(1);
}

// Condition ratings are a number between 0 and 9. If the rating is not
// applicable, the rating is `N`. To efficiently store the rating in the
// database, we'll use the integer data type, which cannot be `N`. For that
// reason, we'll convert `N`s to `null`. This function is used later to do that.
const processConditionRating = (rating) => {
  if (rating === "N") return null;
  return rating;
};

// Preprocess the data before inserting into the database. This involves mapping
// over each row and transforming some properies (columns). At the very least,
// each key is converted to camelCase. For some columns, further transformation
// is done
const preprocessed = parsed.data.map((row) => {
  return {
    age: row["Bridge Age (yr)"],
    built: row["27 - Year Built"],
    condition: row["CAT10 - Bridge Condition"],

    // Use the `processConditionRating()` function defined above to convert `N`s
    // to `null`s.
    conditionRatingDeck: processConditionRating(
      row["58 - Deck Condition Rating"],
    ),
    conditionRatingSubstructure: processConditionRating(
      row["60 - Substructure Condition Rating"],
    ),
    conditionRatingSuperstructure: processConditionRating(
      row["59 - Superstructure Condition Rating"],
    ),
    cost: row["96 - Total Project Cost"],

    // While the codes are comprised of numbers, they should be represented as
    // strings
    countyCode: row["3 - County Code"]?.toString(),
    countyName: row["3 - County Name"],
    dailyTrafficAvg: row["29 - Average Daily Traffic"],
    dailyTrafficAvgFuture: row["114 - Future Average Daily Traffic"],
    dailyTrafficAvgFutureYear:
      row["115 - Year of Future Average Daily Traffic"],
    dailyTrafficAvgYear: row["30 - Year of Average Daily Traffic"],
    dailyTrafficTruckAvg:
      row["Computed - Average Daily Truck Traffic (Volume)"],

    // This is a percentage represented as a whole number. Examples: `44`, 80`,
    // `56`, etc. Convert to decimal percentage for easier calculation later.
    // Examples: `0.44`, `0.8`, `0.56`, etc.
    dailyTrafficTruckAvgPct:
      row["109 - Average Daily Truck Traffic (Percent ADT)"] === null
        ? null
        : row["109 - Average Daily Truck Traffic (Percent ADT)"] / 100,
    deckArea: row["CAT29 - Deck Area (sq. ft.)"],
    design: row["43B - Main Span Design"],
    inspectionFrequency: row["91 - Designated Inspection Frequency"],
    inventoryRating: row["66 - Inventory Rating (US tons)"],
    latitude: row["16 - Latitude (decimal)"],
    length: row["49 - Structure Length (ft.)"],
    longitude: row["17 - Longitude (decimal)"],
    material: row["43A - Main Span Material"],
    maxSpan: row["48 - Length of Maximum Span (ft.)"],
    operatingRating: row["64 - Operating Rating (US tons)"],
    ownerAgency: row["22 - Owner Agency"],
    placeCode: row["City - InfoBridge Place Code"]?.toString(),
    placeName: row["City - InfoBridge Place Name"],
    reconstructed: row["106 - Year Reconstructed"],
    relativeHumidityAvg:
      row["Average Relative Humidity"] === null
        ? null
        : row["Average Relative Humidity"] / 100,
    roadwayWidth: row["51 - Bridge Roadway Width Curb to Curb (ft.)"],
    skewAngle: row["34 - Skew Angle (degrees)"],
    spansMainUnit: row["45 - Number of Spans in Main Unit"],
    stateCode: row["1 - State Code"],
    stateName: row["1 - State Name"],
    structureNumber: row["8 - Structure Number"],
    temperatureAvg: row["Average Temperature"],
    temperatureMax: row["Maximum Temperature"],
    temperatureMin: row["Minimum Temperature"],
    windSpeedMean: row["Mean Wind Speed"],
    year: row["Year"],
  };
});

// Remove all existing data from the database table
await db("Inspection").del();

// Batch insert the preproccessed data. 500 rows at a time.
await db.batchInsert("Inspection", preprocessed, 500);

// Disconnect from the database
await db.destroy();
