// Import functions and objects from Node.js, 3rd party libraries, and our own
// external code
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import papaparse from "papaparse";
import { db } from "./db.js";
import { byYearDesc, extractUnique, processConditionRating } from "./lib.js";

// A constant that represents this file's filepath. Useful to create filepaths
// relative to this file.
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

// Compile array of unique state, county, and place codes and names. These all
// come with pre-assigned codes.
const states = extractUnique(parsed.data, "1 - State Code", "1 - State Name");
const counties = extractUnique(
  parsed.data,
  "3 - County Code",
  "3 - County Name",
);
const places = extractUnique(
  parsed.data,
  "City - InfoBridge Place Code",
  "City - InfoBridge Place Name",
);

// Compile array of unique designs, materials, and owner agencies. A new
// incremental number is assigned as an identifying code for each one.
const designs = extractUnique(parsed.data, null, "43B - Main Span Design");
const materials = extractUnique(parsed.data, null, "43A - Main Span Material");
const ownerAgencies = extractUnique(parsed.data, null, "22 - Owner Agency");

// Compile array of unique structures. If structure appears in multiple
// inspections, the data from the most recent one is used. Most of the data
// included here will not change over time.
const structures = parsed.data.sort(byYearDesc).reduce((prev, curr) => {
  const structureNumber = curr["8 - Structure Number"]?.toString();

  const found = prev.find((structure) => structure.number === structureNumber);

  if (!found) {
    prev.push({
      number: structureNumber,
      built: curr["27 - Year Built"],
      countyCode: curr["3 - County Code"]?.toString(),
      deckArea: curr["CAT29 - Deck Area (sq. ft.)"],

      // Find the design code in the previously generated array
      designCode: designs.find(
        (design) => design.name === curr["43B - Main Span Design"],
      ).code,
      inspectionFrequency: curr["91 - Designated Inspection Frequency"],
      inventoryRating: curr["66 - Inventory Rating (US tons)"],
      latitude: curr["16 - Latitude (decimal)"],
      length: curr["49 - Structure Length (ft.)"],
      longitude: curr["17 - Longitude (decimal)"],
      materialCode: materials.find(
        (material) => material.name === curr["43A - Main Span Material"],
      ).code,
      span: curr["48 - Length of Maximum Span (ft.)"],
      operatingRating: curr["64 - Operating Rating (US tons)"],
      ownerAgencyCode: ownerAgencies.find(
        (ownerAgency) => ownerAgency.name === curr["22 - Owner Agency"],
      ).code,
      reconstructed: curr["106 - Year Reconstructed"],
      roadwayWidth: curr["51 - Bridge Roadway Width Curb to Curb (ft.)"],
      skew: curr["34 - Skew Angle (degrees)"],
      spansMainUnit: curr["45 - Number of Spans in Main Unit"],
    });
  }

  return prev;
}, []);

// Preprocess the inspection data before inserting into the database. This
// involves mapping over each row and transforming some properies (columns). At
// the very least, each key is converted to camelCase. For some columns, further
// transformation is done
const inspections = parsed.data.map((row) => {
  return {
    structureNumber: row["8 - Structure Number"]?.toString(),
    year: row["Year"],
    age: row["Bridge Age (yr)"],
    condition: row["CAT10 - Bridge Condition"],
    conditionRatingDeck: processConditionRating(
      row["58 - Deck Condition Rating"],
    ),
    conditionRatingSubstructure: processConditionRating(
      row["60 - Substructure Condition Rating"],
    ),
    conditionRatingSuperstructure: processConditionRating(
      row["59 - Superstructure Condition Rating"],
    ),

    // Source data is in thousands of dollars. Multiply to get actual value.
    projectCost: row["96 - Total Project Cost"] * 1000,
    dailyTrafficAvg: row["29 - Average Daily Traffic"],
    dailyTrafficAvgFuture: row["114 - Future Average Daily Traffic"],
    dailyTrafficAvgFutureYear:
      row["115 - Year of Future Average Daily Traffic"],
    dailyTrafficAvgYear: row["30 - Year of Average Daily Traffic"],
    dailyTrafficTruckAvg:
      row["Computed - Average Daily Truck Traffic (Volume)"],

    // These next two properties are percentages, but they're represented as
    // whole numbers. Examples: `44`, 80`, `56`, etc. Convert to decimal
    // percentages for easier calculation later. Examples: `0.44`, `0.8`,
    // `0.56`, etc.
    dailyTrafficTruckAvgPct:
      row["109 - Average Daily Truck Traffic (Percent ADT)"] === null
        ? null
        : row["109 - Average Daily Truck Traffic (Percent ADT)"] / 100,
    relativeHumidityAvg:
      row["Average Relative Humidity"] === null
        ? null
        : row["Average Relative Humidity"] / 100,
    temperatureAvg: row["Average Temperature"],
    temperatureMax: row["Maximum Temperature"],
    temperatureMin: row["Minimum Temperature"],
    windSpeedMean: row["Mean Wind Speed"],
  };
});

// Remove all existing data from the database table
await db("Inspection").del();
await db("Structure").del();
await db("OwnerAgency").del();
await db("Material").del();
await db("Design").del();
await db("Place").del();
await db("County").del();
await db("State").del();

// Batch insert the newly processed data. Some rows must be limited to 500 rows
// at a time because there are many fields
await db.batchInsert("State", states);
await db.batchInsert("County", counties);
await db.batchInsert("Place", places);
await db.batchInsert("Design", designs);
await db.batchInsert("Material", materials);
await db.batchInsert("OwnerAgency", ownerAgencies);
await db.batchInsert("Structure", structures, 500);
await db.batchInsert("Inspection", inspections, 500);

// Disconnect from the database
await db.destroy();
