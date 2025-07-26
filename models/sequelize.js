const { Sequelize } = require("sequelize");


/*
| Before                     | After                                  |
| ----------------------------- | -------------------------------------- |
| `user.js` required `index.js` | `user.js` only requires `sequelize.js` |
| `index.js` required `user.js` | `index.js` just imports models cleanly |
| no more Circular dependency   |  Dependency chain is one-directional  |
| no more Runtime crash         |  Stable DB connection and sync        |


*/ 




const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
