"use strict";
const { Register, Login, ForgotPassword } = require("./Auth");

module.exports.register = async (event) => {
  return Register(event);
};

module.exports.login = async (event) => {
  return Login(event);
};

module.exports.forgotPassword = async (event) => {
  return ForgotPassword(event);
};
