const { STATUS_CODE, ERROR_MESSAGE } = require("../../shared/constant");
const { responseBuilder } = require("../../shared/responseBuilder");
const { validateHeader } = require("../../shared/validateHeaders");
const { validateRegisterAttributes } = require("./authAttributesValidation");

const Register = (event) => {
  const validity = validateHeader(event);
  if (!validity) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      ERROR_MESSAGE.CUSTOM_HEADERS
    );
  }

  const requestBody = JSON.parse(event.body);
  const { username, email, password } = requestBody;
  if (!requestBody || Object.keys(requestBody).length === 0) {
    return responseBuilder(STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.EMPTY_BODY);
  }
  const validateResult = validateRegisterAttributes({
    username,
    email,
    password,
  });
  if (validateResult.error) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      validateResult.error.details[0].message
    );
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports = { Register };
