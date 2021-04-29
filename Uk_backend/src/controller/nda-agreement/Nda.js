const { STATUS_CODE, ERROR_MESSAGE } = require("../../shared/constant");
const { responseBuilder } = require("../../shared/responseBuilder");
const { validateHeader } = require("../../shared/validateHeaders");
const NdaService = require("../../services/NdaService");
const authorizationService = require("../../services/authorizationService");

const Nda = (event) => {
  const validity = validateHeader(event);
  if (!validity) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      ERROR_MESSAGE.CUSTOM_HEADERS
    );
  }
  // check autherization
  const autherize = authorizationService(event);
  if (!autherize.email_verified == false && !autherize.email) {
    return {
      body: JSON.stringify({
        error: "UnAutherized",
      }),
    };
  }

  return NdaService(event);
};

module.exports = { Nda };
