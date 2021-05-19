/*
 * Author: Hashika
 * Date: 18/05/2021
 * Copyright © 2021 BookingSite. All rights reserved.
 *
 * Booking Entity
 */

const { TABLES } = require("../constant");

const timeBookingEntity = (sequelize, DataTypes) => {
  return sequelize.define(
    TABLES.USER_BOOKING,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId:{
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      firstDate: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      secondDate: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING(50),
        allowNull: false,
      }
    },
    {
      freezeTableName: true,
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    }
  );
};

module.exports = timeBookingEntity;
