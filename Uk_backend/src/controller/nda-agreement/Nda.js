const { STATUS_CODE, ERROR_MESSAGE } = require("../../shared/constant");
const { responseBuilder } = require("../../shared/responseBuilder");
const { validateHeader } = require("../../shared/validateHeaders");
const NdaService = require("../../services/NdaService");
const authorizationService = require("../../services/authorizationService");

const Nda = async (event) => {
  try {
    const validity = validateHeader(event);
    if (!validity) {
      return responseBuilder(
        STATUS_CODE.BAD_REQUEST,
        ERROR_MESSAGE.CUSTOM_HEADERS
      );
    }
    const { email } = event.queryStringParameters;
    // check autherization
    const autherize = await authorizationService(event);

    if (!autherize.email == email) {
      return {
        body: JSON.stringify({
          error: "UnAutherized",
        }),
      };
    }
    return await NdaService(email);
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

module.exports = { Nda };
