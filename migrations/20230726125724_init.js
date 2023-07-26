export const up = (knex) => {
  return knex.schema
    .createTable("State", (table) => {
      table.text("code");
      table.text("name");
      table.primary("code");
    })
    .createTable("County", (table) => {
      table.text("code");
      table.text("name");
      table.primary("code");
    })
    .createTable("Place", (table) => {
      table.text("code");
      table.text("name");
      table.primary("code");
    })
    .createTable("Design", (table) => {
      table.integer("code");
      table.text("name");
      table.primary("code");
    })
    .createTable("Material", (table) => {
      table.integer("code");
      table.text("name");
      table.primary("code");
    })
    .createTable("OwnerAgency", (table) => {
      table.text("code");
      table.text("name");
      table.primary("code");
    })
    .createTable("ConditionRating", (table) => {
      table.integer("code");
      table.text("description");
      table.text("detail");
      table.primary("code");
    })
    .createTable("Structure", (table) => {
      table.text("number");
      table.integer("built");
      table.text("countyCode");
      table.decimal("deckArea", 8, 1);
      table.text("designCode");
      table.integer("inspectionFrequency");
      table.decimal("latitude", 8, 7);
      table.decimal("length", 6, 1);
      table.decimal("longitude", 8, 7);
      table.text("materialCode");
      table.decimal("span", 5, 1);
      table.decimal("inventoryRating", 4, 1);
      table.decimal("operatingRating", 4, 1);
      table.text("ownerAgencyCode");
      table.text("placeCode");
      table.integer("reconstructed");
      table.decimal("roadwayWidth", 4, 1);
      table.integer("skew").checkBetween([0, 99]);
      table.integer("spansMainUnit");
      table.text("stateCode");
      table.primary("number");
      table.foreign("stateCode").references("code").on("State");
      table.foreign("countyCode").references("code").on("County");
      table.foreign("placeCode").references("code").on("Place");
      table.foreign("designCode").references("code").on("Design");
      table.foreign("materialCode").references("code").on("Material");
      table.foreign("ownerAgencyCode").references("code").on("OwnerAgency");
    })
    .createTable("Inspection", (table) => {
      table.text("structureNumber");
      table.integer("year");
      table.integer("age");
      table.enu("condition", ["Fair", "Good", "Poor"]);
      table.integer("conditionRatingDeck").checkBetween([0, 9]);
      table.integer("conditionRatingSubstructure").checkBetween([0, 9]);
      table.integer("conditionRatingSuperstructure").checkBetween([0, 9]);
      table.integer("projectCost");
      table.integer("dailyTrafficAvg");
      table.integer("dailyTrafficAvgFuture");
      table.integer("dailyTrafficAvgFutureYear");
      table.integer("dailyTrafficAvgYear");
      table.integer("dailyTrafficTruckAvg");
      table.decimal("dailyTrafficTruckAvgPct", 3, 2).checkBetween([0, 1]);
      table.decimal("relativeHumidityAvg", 3, 2).checkBetween([0, 1]);
      table.decimal("temperatureAvg", 3, 1);
      table.decimal("temperatureMax", 3, 1);
      table.decimal("temperatureMin", 3, 1);
      table.integer("windSpeedMean");
      table.foreign("structureNumber").references("number").on("Structure");
      table
        .foreign("conditionRatingDeck")
        .references("code")
        .on("ConditionRating");
      table
        .foreign("conditionRatingSubstructure")
        .references("code")
        .on("ConditionRating");
      table
        .foreign("conditionRatingSuperstructure")
        .references("code")
        .on("ConditionRating");
    })
    .createTable("Metadata", (table) => {
      table.text("table");
      table.text("column");
      table.text("unit");
      table.text("description");
      table.primary(["table", "column"]);
    });
};

export const down = (knex) => {
  return knex.schema
    .dropTable("Metadata")
    .dropTable("Inspection")
    .dropTable("Structure")
    .dropTable("ConditionRating")
    .dropTable("OwnerAgency")
    .dropTable("Material")
    .dropTable("Design")
    .dropTable("Place")
    .dropTable("County")
    .dropTable("State");
};
