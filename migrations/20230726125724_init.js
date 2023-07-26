export const up = (knex) => {
  return knex.schema.createTable("nbi", (table) => {
    // table.text("col1");
  });
};

export const down = (knex) => {
  return knex.schema.dropTable("nbi");
};
