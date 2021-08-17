var dbUrl;

if (process.env.DATABASE_URL) {
  dbUrl = process.env.DATABASE_URL;
} else if (
  process.env.DATABASE_NAME &&
  process.env.DATABASE_USER &&
  process.env.DATABASE_PASSWORD &&
  process.env.DATABASE_HOST &&
  process.env.DATABASE_PORT
) {
  dbUrl =
    "mongodb://" +
    process.env.DATABASE_USER +
    ":" +
    process.env.DATABASE_PASSWORD +
    "@" +
    process.env.DATABASE_HOST +
    ":" +
    process.env.DATABASE_PORT +
    "/" +
    process.env.DATABASE_NAME;
} else {
  dbUrl = "mongodb://localhost:27017/test";
}

var config = {
  database: {
    url: dbUrl,
  },
  server: {
    host: "127.0.0.1",
    port: "3000",
  },
};

module.exports = config;
