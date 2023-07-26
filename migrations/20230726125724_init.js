export const up = (knex) => {
  return knex.schema.createTable("Inspection", (table) => {
    table.integer("age");
    table.integer("built");
    table.enu("condition", ["Fair", "Good", "Poor"]);
    table.integer("conditionRatingDeck").checkBetween([0, 9]);
    table.integer("conditionRatingSubstructure").checkBetween([0, 9]);
    table.integer("conditionRatingSuperstructure").checkBetween([0, 9]);
    table.integer("cost");
    table.text("countyCode");
    table.text("countyName");
    table.integer("dailyTrafficAvg");
    table.integer("dailyTrafficAvgFuture");
    table.integer("dailyTrafficAvgFutureYear");
    table.integer("dailyTrafficAvgYear");
    table.integer("dailyTrafficTruckAvg");
    table.decimal("dailyTrafficTruckAvgPct", 3, 2).checkBetween([0, 1]);
    table.decimal("deckArea", 8, 1);
    table.text("design");
    table.integer("inspectionFrequency");
    table.decimal("inventoryRating", 4, 1);
    table.decimal("latitude", 8, 7);
    table.decimal("length", 6, 1);
    table.decimal("longitude", 8, 7);
    table.text("material");
    table.decimal("maxSpan", 5, 1);
    table.decimal("operatingRating", 4, 1);
    table.text("ownerAgency");
    table.text("placeCode");
    table.text("placeName");
    table.integer("reconstructed");
    table.decimal("relativeHumidityAvg", 3, 2).checkBetween([0, 1]);
    table.decimal("roadwayWidth", 4, 1);
    table.integer("skewAngle").checkBetween([0, 99]);
    table.integer("spansMainUnit");
    table.text("stateCode");
    table.text("stateName");
    table.text("structureNumber");
    table.decimal("temperatureAvg", 3, 1);
    table.decimal("temperatureMax", 3, 1);
    table.decimal("temperatureMin", 3, 1);
    table.integer("windSpeedMean").checkBetween([0, 12]);
    table.integer("year");
  });
};

export const down = (knex) => {
  return knex.schema.dropTable("nbi");
};
