const AmozonCognitoIdentity = require("amazon-cognito-identity-js");
const nodemailer = require("nodemailer");
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
const host = require('../shared/environment/env.json');
const sendEmailWithPdf = require("../controller/mails/emailWithPdf");

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
    // await sendEmailWithPdf();
    // let transport = await nodemailer.createTransport({
    //   host: "smtp.office365.com",
    //   port: 587,
    //   auth: {
    //     user: process.env.HOST_USER,
    //     pass: process.env.HOST_PASSWORD,
    //   },
    // });

    // const message = {
    //   from: host.mail.user, 
    //   to: email,
    //   subject: "Booking Status",
    //   text: "You have booked a day, Thank You!",
    // };

    // await transport.sendMail(message, function (err, info) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log(info);
    //   }
    // });

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

const BookStateService = async (id) => {
  try{
    const isExist = await checkBooking(id);
    if (isExist) {
      return {
        body: JSON.stringify({
          message: "User Already Booked",
          state: true
        }),
        statusCode: STATUS_CODE.BAD_REQUEST,
      };
    }
  }catch(err){
    return {
      body: JSON.stringify(err),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
}

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
const CheckExpiryService = async (id) => {
  const isExist = await checkBooking(id);
  if (!isExist) {
    return {
      body: JSON.stringify({
        error: "Id is not match for user",
      }),
      statusCode: STATUS_CODE.BAD_REQUEST,
    };
  }
  const getBookDates = await getBookDate(id);
  if (getBookDates) {
    const isExpiry = await _checkExpiryDate(getBookDates);
    if (isExpiry) {
      //update the user state to expire
      await updateExpiry(id, "Expired");
      return {
        body: JSON.stringify({ expiry: "Expired" }),
      };
    }
    return {
      body: JSON.stringify({ expiry: "Active" }),
    };
  } else
    return {
      body: JSON.stringify({ error: "Data is null " }),
      statusCode: STATUS_CODE.BAD_REQUEST,
    };
};

const _checkExpiryDate = (getBookDates) => {
  const firstDate = parseInt(getBookDates.firstDate);
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, "0");
  const currentDay = parseInt(dd);
  if (currentDay < firstDate) return false;
  else return true;
};

module.exports = {
  BookService,
  SendBookService,
  BookingPriceService,
  BookStateService,
  CheckExpiryService,
};
