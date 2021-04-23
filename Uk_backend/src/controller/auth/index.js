"use strict";
const { Register, Login } = require("./Auth");

module.exports.register = async (event) => {
  return Register(event);
};

module.exports.login = async (event) => {
  return Login(event);
};
