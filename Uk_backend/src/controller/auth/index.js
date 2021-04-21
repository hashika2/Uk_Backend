'use strict';

const { Register } = require("./Auth");

module.exports.register = async (event,context) => {
  return Register(event)
};
