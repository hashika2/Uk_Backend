"use strict";
const { SetDate, BookDate, BookPrice } = require("./Book");
const nodemailer = require('nodemailer');
/*
 * Author: Hashika
 * Date: 18/05/2021
 * Copyright © 2021 CellcardPlay. All rights reserved.
 *
 * Book Entity
 */
module.exports.setDate = async (event) => {
  return await SetDate(event);
};

module.exports.bookDate = async (event) => {
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
    // await SES.sendEmail(params).promise();
    let transport = await nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      auth: {
        user: "info@codexlabstechnologies.com",
        pass: "|lSFDtuM#K6M",
      },
    });

    // let transport = nodemailer.createTransport({
    //   service: "hotmail",
    //   auth: {
    //     user: "outlook_D153FB64C3419942@outlook.com",
    //     pass: "Hashika1996",
    //   },
    // });

    const message = {
      from: "info@codexlabstechnologies.com", // Sender address
      to: "hashikamaduranga108@gmail.com", // List of recipients
      subject: "Design Your Model S | Tesla", // Subject line
      text: "Have the most fun you can in a car. Get your Tesla today!", // Plain text body,
    };
return{
  body:JSON.stringify(
   await Promise((resole,reject)=>{
       transport.sendMail(message, function (err, info) {
       if (err) {
         console.log(err);
         reject(err)
       } else {
         console.log(info);
         resole(info)
       }
     });
   })  
  )
}
    // return {
    //   statusCode: 200,
    // };
  } catch (error) {
    return {
      body: JSON.stringify(error),
      statusCode: 400,
    };
  }
};
