const { STATUS_CODE, ERROR_MESSAGE } = require("../../shared/constant");
const { responseBuilder } = require("../../shared/responseBuilder");
const { validateHeader } = require("../../shared/validateHeaders");
const { validatePaymentAttribute } = require("./paymentAttributeValidation");
const { checkPaymentTypeService } = require("../../services/paymentService");
const authorizationService = require("../../services/authorizationService");

const PaymentType = async (event) => {
  console.log(event.queryStringParameters);
  const validity = validateHeader(event);
  if (!validity) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      ERROR_MESSAGE.CUSTOM_HEADERS
    );
  }
  const { cardNumber } = event.queryStringParameters;
  const validateResult = validatePaymentAttribute({ cardNumber });

  if (validateResult.error) {
    return responseBuilder(
      STATUS_CODE.BAD_REQUEST,
      validateResult.error.details[0].message
    );
  }
  /** check autherization **/
  const autherize = await await authorizationService(event);
  if (autherize.statusCode !== 200) {
    return {
      body: JSON.stringify({
        error: autherize.body,
      }),
      statusCode: STATUS_CODE.UNAUTHERIZED,
    };
  }

  return await checkPaymentTypeService(cardNumber);
};

module.exports = PaymentType;
