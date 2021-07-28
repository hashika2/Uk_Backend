const AWS = require('aws-sdk');
const nodemailer = require('nodemailer')

async function sendEmailWithAttachments(
    subject,
    html,
    toAddresses,
    attachments
  ) {
    const ses = new AWS.SES();
    let transporter = await nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      auth: {
        user: process.env.HOST_USER,
        pass: process.env.HOST_PASSWORD,
      },
    });
    const mailOptions = {
      from: "hashikamaduranga96@outlook.com",
      subject,
      html,
      to: toAddresses,
      attachments
    };
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
        }
    });
  }

  module.exports = {sendEmailWithAttachments}