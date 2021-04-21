"use strict";
const { Register } = require("./Auth");

module.exports.register = async (event) => {
  return Register(event);
};
