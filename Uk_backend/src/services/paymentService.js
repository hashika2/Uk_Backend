const { STATUS_CODE } = require("../shared/constant");

const lookup = require("binlookup")();

const checkPaymentTypeService = async (cardNumber) => {
  try {
    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
          lookup(cardNumber, function (err, data) {
            if (err) {
              console.error(err);
              reject(err);
            }
            resolve(data);
          });
        })
      ),
    };
  } catch (err) {
      return {
          body: JSON.stringify(err),
          statusCode: STATUS_CODE.SERVER_ERROR
      }
  }
};

module.exports = { checkPaymentTypeService };
