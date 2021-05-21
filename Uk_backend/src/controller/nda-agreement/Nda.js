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
    const { email, id } = event.queryStringParameters;
    /** check autherization **/
    const autherize = await (await authorizationService(event));
    if ((autherize.statusCode) !== 200) {
      return {
        body: JSON.stringify({
          error: autherize.body,
        }),
        statusCode: STATUS_CODE.UNAUTHERIZED,
      };
    }
    return await NdaService(email, id);
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

module.exports = { Nda };
