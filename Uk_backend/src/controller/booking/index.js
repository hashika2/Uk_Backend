"use strict";
const { BookDate, BookPrice } = require("./Book");
/*
 * Author: Hashika
 * Date: 18/05/2021
 * Copyright © 2021 CellcardPlay. All rights reserved.
 *
 * Book Entity
 */
module.exports.setDate = async (event) => {
  return await BookDate(event);
};

module.exports.bookingPrice = async (event) => {
  return await BookPrice(event);
};

const AWS = require("aws-sdk");
const SES = new AWS.SES();

module.exports.sendEmail = async (event) => {
  const params = {
    Destination: {
      ToAddresses: ["hashikamaduranga108@gmail.com"],
    },
    Message: {
      Body: {
        Text: { Data: "Date is booked" },
      },
      Subject: { Data: "Booking Alert" },
    },
    Source: "m.g.hashikamaduranga@gmail.com",
  };

  try {
    await SES.sendEmail(params).promise();
    return {
      statusCode: 200,
    };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: 400,
    };
  }
};
