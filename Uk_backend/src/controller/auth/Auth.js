const { STATUS_CODE, ERROR_MESSAGE } = require("../../shared/constant");
const { responseBuilder } = require("../../shared/responseBuilder");
const { validateHeader } = require("../../shared/validateHeaders");
const {
  validateRegisterAttributes,
  validateLoginAttributes,
} = require("./authAttributesValidation");
const { RegisterService, LoginService } = require("../../services/AuthService");

const Register = (event) => {
  const validity = validateHeader(event);
  if (!validity) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      ERROR_MESSAGE.CUSTOM_HEADERS
    );
  }

  const requestBody = JSON.parse(event.body);
  const { username, email, password, company, address, phone } = requestBody;
  if (!requestBody || Object.keys(requestBody).length === 0) {
    return responseBuilder(STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.EMPTY_BODY);
  }
  const validateResult = validateRegisterAttributes({
    username,
    email,
    password,
    company,
    address,
    phone,
  });
  if (validateResult.error) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      validateResult.error.details[0].message
    );
  }
  return RegisterService(requestBody);
};

const Login = async (event) => {
  const validity = validateHeader(event);
  if (!validity) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      ERROR_MESSAGE.CUSTOM_HEADERS
    );
  }

  const requestBody = JSON.parse(event.body);
  const { email, password } = requestBody;
  if (!requestBody || Object.keys(requestBody).length === 0) {
    return responseBuilder(STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.EMPTY_BODY);
  }
  const validateResult = validateLoginAttributes({
    email,
    password,
  });
  if (validateResult.error) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      validateResult.error.details[0].message
    );
  }
    
  return LoginService(email, password);
};

module.exports = { Register, Login };
