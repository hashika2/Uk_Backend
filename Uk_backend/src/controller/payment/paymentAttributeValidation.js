const Joi = require("joi");
const { validateObject } = require("../../shared/utilities");

const cardNumber = Joi.string().required();

const validatePaymentAttribute = (insertAttributes) => {
  const schema = { cardNumber };
  return validateObject(schema, insertAttributes);
};

module.exports = { validatePaymentAttribute };
