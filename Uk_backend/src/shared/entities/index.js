const Sequelize = require("sequelize");
const databaseEnv = require("../environment");
const userEntity = require("./userEntity");
const mysql2 = require('mysql2');
const timeBookingEntity = require("./timeBookingEntity");

const sequelize = new Sequelize(
  databaseEnv.database,
  databaseEnv.user,
  databaseEnv.password,
  {
    dialect: "mysql",
    dialectModule:mysql2,  // mysql2 confuce
    dialectOptions: {
      supportBigNumbers: true,
      decimalNumbers: true,
    },
    host: databaseEnv.host,
    port: databaseEnv.port,
    logging: console.log,
    define: {
      timestamps: false,
    },
  }
);

const User = userEntity(sequelize, Sequelize);
const User_Booking = timeBookingEntity(sequelize,Sequelize)

module.exports = { User, User_Booking };
