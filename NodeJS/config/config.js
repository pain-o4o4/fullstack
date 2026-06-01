require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "123456",
    database: process.env.DB_NAME || "fullstack",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3307,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 2,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.DB_USER || "bookingcare_user",
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "dbpassword123",
    database: process.env.DB_NAME || "bookingcare",
    host: process.env.DB_HOST || "mysql-db",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false
  }
};
