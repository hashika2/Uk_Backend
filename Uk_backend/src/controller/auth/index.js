"use strict";
const { Register, Login, ForgotPassword, ConfirmPassword } = require("./Auth");

module.exports.register = async (event) => {
  return Register(event);
};

module.exports.login = async (event) => {
  return Login(event);
};

module.exports.forgotPassword = async (event) => {
  return ForgotPassword(event);
};

module.exports.confirmPassword = async (event) => {
  return ConfirmPassword(event);
};
