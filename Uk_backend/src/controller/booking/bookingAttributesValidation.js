const Joi = require("joi");
const { validateObject } = require("../../shared/utilities");

const id = Joi.string().required();
const firstDate = Joi.string().required();
const secondDate = Joi.string().required();
const country = Joi.string().required();
const city = Joi.string().required();
const status = Joi.string().required();
const clientType = Joi.string().required();

const bookingAttributes = (insertAttributes) => {
  const schema = {
    id,
    firstDate,
    secondDate,
    country,
    city,
    status,
    clientType
  };
  return validateObject(schema, insertAttributes);
};

module.exports = { bookingAttributes };
