// Import the Knex.js library
import knex from "knex";

// Import the knexfile that contains our database configuraton
import knexfile from "../knexfile.js";

// Export a function that represents our database for interaction. Use whatever
// environment context Node.js thinks we're in, but default to development
export const db = knex(knexfile[process.env.NODE_ENV || "development"]);
