export default {
  development: {
    client: "better-sqlite3",
    connection: {
      filename: "./db.sqlite3",
    },
    useNullAsDefault: true,
  },
};
