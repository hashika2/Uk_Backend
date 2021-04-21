const Joi = require("joi");
const { validateObject } = require("../../shared/utilities");

const username = Joi.string().required();
const email = Joi.string().required();
const password = Joi.string().required();
const token = Joi.string().required();

const validateRegisterAttributes = (insertAttributes) => {
  const schema = {
    username,
    email,
    password,
  };
  return validateObject(schema, insertAttributes);
};

module.exports = { validateRegisterAttributes };
