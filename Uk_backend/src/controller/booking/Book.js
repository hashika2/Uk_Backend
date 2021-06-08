const { STATUS_CODE, ERROR_MESSAGE } = require("../../shared/constant");
const { responseBuilder } = require("../../shared/responseBuilder");
const { validateHeader } = require("../../shared/validateHeaders");
const {BookService, SendBookService, BookingPriceService} = require("../../services/BookService");
const authorizationService = require("../../services/authorizationService");
const { bookingAttributes } = require("./bookingAttributesValidation");

/*
 * Author: Hashika
 * Date: 18/05/2021
 * Copyright © 2021 BookingSite. All rights reserved.
 * 
 * Book Entity
 */
const SetDate = async (event) => {
  try {
    const validity = validateHeader(event);
    if (!validity) {
      return responseBuilder(
        STATUS_CODE.BAD_REQUEST,
        ERROR_MESSAGE.CUSTOM_HEADERS
      );
    }

    const requestBody = JSON.parse(event.body);
    if (!requestBody || Object.keys(requestBody).length === 0) {
      return responseBuilder(STATUS_CODE.BAD_REQUEST, ERROR_MESSAGE.EMPTY_BODY);
    }
    const { id } = event.queryStringParameters;
    const { firstDate, secondDate, country, city, status, clientType } = requestBody;
    const validateResult = bookingAttributes({
      id,
      firstDate,
      secondDate,
      country,
      city,
      status,
      clientType
    });
    if (validateResult.error) {
      return responseBuilder(
        STATUS_CODE.BAD_REQUEST,
        validateResult.error.details[0].message
      );
    }
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
    return await BookService(id,requestBody);
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

const BookDate = async (event) => {
  try {
    const validity = validateHeader(event);
    if (!validity) {
      return responseBuilder(
        STATUS_CODE.BAD_REQUEST,
        ERROR_MESSAGE.CUSTOM_HEADERS
      );
    }

    return await SendBookService();
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

const BookPrice = async (event) => {
  try {
    const validity = validateHeader(event);
    if (!validity) {
      return responseBuilder(
        STATUS_CODE.BAD_REQUEST,
        ERROR_MESSAGE.CUSTOM_HEADERS
      );
    }

    return await BookingPriceService();
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

module.exports = { SetDate, BookDate, BookPrice };
