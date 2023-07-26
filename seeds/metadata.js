export const seed = async (knex) => {
  // Delete existing metadata
  await knex("Metadata").del();

  // Insert description of each column in all tables
  await knex("Metadata").insert([
    {
      table: "ConditionRating",
      column: "code",
      unit: null,
      description:
        "The code identifying the condition rating as defined by NBI.",
    },
    {
      table: "ConditionRating",
      column: "description",
      unit: null,
      description: "The description of the condition rating.",
    },
    {
      table: "ConditionRating",
      column: "detail",
      unit: null,
      description: "More detailed information about the condition rating.",
    },
    {
      table: "County",
      column: "code",
      unit: null,
      description:
        "The Federal Information Processing System (FIPS) code of the county in a U.S. state.",
    },
    {
      table: "County",
      column: "name",
      unit: null,
      description: "The name of the county in a U.S. state.",
    },
    {
      table: "Design",
      column: "code",
      unit: null,
      description:
        "The automatically incrementing code used to identify the design of the main span of the bridge.",
    },
    {
      table: "Design",
      column: "name",
      unit: null,
      description: "The name of the design of the main span of the bridge.",
    },
    {
      table: "Inspection",
      column: "structureNumber",
      unit: null,
      description:
        "The unique identifier for a structure in the National Bridge Inventory (NBI).",
    },
    {
      table: "Inspection",
      column: "year",
      unit: null,
      description: "The year the bridge inspection was conducted.",
    },
    {
      table: "Inspection",
      column: "age",
      unit: "Years",
      description: "The age of the bridge at time of inspection.",
    },
    {
      table: "Inspection",
      column: "condition",
      unit: "23 CFR 490 Subpart D",
      description: "The bridge condition as defined by 23 CFR 490 Subpart D.",
    },
    {
      table: "Inspection",
      column: "conditionRatingDeck",
      unit: "NBI Condition Rating",
      description: "The condition rating of the bridge deck.",
    },
    {
      table: "Inspection",
      column: "conditionRatingSubstructure",
      unit: "NBI Condition Rating",
      description: "The condition rating of the bridge substructure.",
    },
    {
      table: "Inspection",
      column: "conditionRatingSuperstructure",
      unit: "NBI Condition Rating",
      description: "The condition rating of the bridge substructure.",
    },
    {
      table: "Inspection",
      column: "projectCost",
      unit: "United States Dollars",
      description:
        "Estimated total project costs associated with the proposed bridge improvement project, including incidental costs.",
    },
    {
      table: "Inspection",
      column: "dailyTrafficAvg",
      unit: null,
      description: "Average daily traffic volume for the inventory route.",
    },
    {
      table: "Inspection",
      column: "dailyTrafficAvgFuture",
      unit: null,
      description:
        "The forecasted average daily traffic (ADT) for the inventory route.",
    },
    {
      table: "Inspection",
      column: "dailyTrafficAvgFutureYear",
      unit: null,
      description:
        "The year represented by the future ADT identified in dailyTrafficAvgFuture.",
    },
    {
      table: "Inspection",
      column: "dailyTrafficAvgYear",
      unit: null,
      description:
        "The year represented by the ADT identified in dailyTrafficAvg.",
    },
    {
      table: "Inspection",
      column: "dailyTrafficTruckAvg",
      unit: null,
      description: "The volumn of average daily traffic that is truck traffic.",
    },
    {
      table: "Inspection",
      column: "dailyTrafficTruckAvgPct",
      unit: null,
      description:
        "The percentage that shows the percentage of dailyTrafficAvg that is truck traffic.",
    },
    {
      table: "Inspection",
      column: "relativeHumidityAvg",
      unit: "Percent Water in Air",
      description:
        "The average relative humidity in the location of the bridge.",
    },
    {
      table: "Inspection",
      column: "temperatureAvg",
      unit: "Degrees Celsius",
      description: "The average temperature in the location of the bridge.",
    },
    {
      table: "Inspection",
      column: "temperatureMax",
      unit: "Degrees Celsius",
      description: "The maximum temperature in the location of the bridge.",
    },
    {
      table: "Inspection",
      column: "temperatureMin",
      unit: "Degrees Celsius",
      description: "The minimum temperature in the location of the bridge.",
    },
    {
      table: "Inspection",
      column: "windSpeedMean",
      unit: "Miles per Hour",
      description: "The mean wind speed in the location of the bridge.",
    },
    {
      table: "Material",
      column: "code",
      unit: null,
      description:
        "The automatically incrementing code used to identify the material of the main span of the bridge.",
    },
    {
      table: "Material",
      column: "name",
      unit: null,
      description: "The name of the material of the main span of the bridge.",
    },
    {
      table: "OwnerAgency",
      column: "code",
      unit: null,
      description:
        "The automatically incrementing code used to identify the owner agency.",
    },
    {
      table: "OwnerAgency",
      column: "name",
      unit: null,
      description: "The name of the owner agency.",
    },
    {
      table: "Place",
      column: "code",
      unit: null,
      description: "The InfoBridge place code of the place; often a city.",
    },
    {
      table: "Place",
      column: "name",
      unit: null,
      description: "The InfoBridge name of the place; often a city.",
    },
    {
      table: "State",
      column: "code",
      unit: null,
      description:
        "The Federal Information Processing System (FIPS) code of the U.S. state.",
    },
    {
      table: "State",
      column: "name",
      unit: null,
      description: "The name of the U.S. state.",
    },
    {
      table: "Structure",
      column: "number",
      unit: null,
      description:
        "The unique identifier for a structure in the National Bridge Inventory (NBI).",
    },
    {
      table: "Structure",
      column: "built",
      unit: null,
      description: "The year the structure was built.",
    },
    {
      table: "Structure",
      column: "countyCode",
      unit: null,
      description:
        "The Federal Information Processing System (FIPS) code of the county where the structure exists.",
    },
    {
      table: "Structure",
      column: "deckArea",
      unit: "Square Feet",
      description: "The deck area as defined by 23 CFR 490 Subpart D.",
    },
    {
      table: "Structure",
      column: "designCode",
      unit: null,
      description:
        "The code used to identify the design of the main span of the bridge.",
    },
    {
      table: "Structure",
      column: "inspectionFrequency",
      unit: "Months",
      description:
        "The number of months between designated inspections of the structure.",
    },
    {
      table: "Structure",
      column: "latitude",
      unit: "Degrees",
      description: "The latitude of the position of the structure.",
    },
    {
      table: "Structure",
      column: "length",
      unit: "Feet",
      description: "The length of the maximum span of the bridge.",
    },
    {
      table: "Structure",
      column: "longitude",
      unit: "Degrees",
      description: "The longitude of the position of the structure",
    },
    {
      table: "Structure",
      column: "materialCode",
      unit: null,
      description:
        "The code used to identify the material of the main span of the bridge.",
    },
    {
      table: "Structure",
      column: "span",
      unit: "Feet",
      description: "The length of the maximum span of the bridge.",
    },
    {
      table: "Structure",
      column: "inventoryRating",
      unit: "United States Tons",
      description:
        "The load level that can safely use an existing structure for an indefinite period of time.",
    },
    {
      table: "Structure",
      column: "operatingRating",
      unit: "United States Tons",
      description:
        "The maximum permissible load level to which the structure may be subjected for the load configuration used in the rating.",
    },
    {
      table: "Structure",
      column: "ownerAgencyCode",
      unit: null,
      description:
        "The code used to identify the agency who owns the structure.",
    },
    {
      table: "Structure",
      column: "placeCode",
      unit: null,
      description: "The InfoBridge place code of the place; often a city.",
    },
    {
      table: "Structure",
      column: "reconstructed",
      unit: null,
      description:
        "The year the structure was most recently reconstructed (if any).",
    },
    {
      table: "Structure",
      column: "roadwayWidth",
      unit: "Feet",
      description:
        "The most restrictive minimum distance between curbs or rails on the structure roadway.",
    },
    {
      table: "Structure",
      column: "skew",
      unit: "Degrees",
      description:
        "The angle between the centerline of a pier and a line normal to the roadway centerline. Major variation in skews of substructure units is indicated with 99.",
    },
    {
      table: "Structure",
      column: "spansMainUnit",
      unit: null,
      description: "The number of spans in the main or major unit.",
    },
    {
      table: "Structure",
      column: "stateCode",
      unit: null,
      description:
        "The Federal Information Processing System (FIPS) code of the U.S. state.",
    },
  ]);
};
