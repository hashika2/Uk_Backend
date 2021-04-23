/*
 * Author: Hashika
 * Date: 29/01/2021
 * Copyright © 2021 CellcardPlay. All rights reserved.
 *
 * Auth Entity
 */

const { TABLES } = require("../constant");

const userEntity = (sequelize, DataTypes) => {
  return sequelize.define(
    TABLES.USER,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      companyAddress: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      defaultScope: {
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
    }
  );
};

module.exports = userEntity;
