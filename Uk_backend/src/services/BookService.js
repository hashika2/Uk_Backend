const AmozonCognitoIdentity = require("amazon-cognito-identity-js");
const { STATUS_CODE } = require("../shared/constant");
const {
  ClientIdExtend,
  UserPoolIdExtend,
} = require("../shared/environment/env.json");
const {
  bookingDate,
  getbookingDate,
  checkBooking,
} = require("../shared/repositories/TimeBookingRepo");

const poolData = {
  ClientId: ClientIdExtend,
  UserPoolId: UserPoolIdExtend,
};

/*
 * Author: Hashika
 * Date: 18/05/2021
 * Copyright © 2021 BookingSite. All rights reserved.
 *
 * Auth Entity
 */
const BookService = async (id, requestBody) => {
  try {
    const isExist = await checkBooking(id);
    if (isExist) {
      return {
        body: JSON.stringify({
          error: "User Already Book",
        }),
        statusCode: STATUS_CODE.BAD_REQUEST,
      };
    }
    const userDetails = await bookingDate(id, requestBody);
    return { body: JSON.stringify(userDetails) };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

const SendBookService = async () => {
  try {
    const bookingDate = await getbookingDate();
    return { body: JSON.stringify(bookingDate) };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

const BookingPriceService = () => {
  try {
    return {
      body: JSON.stringify({
        basePrice: {
          USD: {
            twoDayBlock: "25",
            splitService: "30",
          },
          GBP: {
            twoDayBlock: "25",
            splitService: "30",
          },
          EUR: {
            twoDayBlock: "25",
            splitService: "30",
          },
        },
        rest: {
          USD: {
            twoDayBlock: "55",
            splitService: "60",
          },
          GBP: {
            twoDayBlock: "55",
            splitService: "60",
          },
          EUR: {
            twoDayBlock: "55",
            splitService: "60",
          },
        },
      }),
    };
  } catch (err) {
    return {
      body: JSON.stringify(error),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

module.exports = { BookService, SendBookService, BookingPriceService };
