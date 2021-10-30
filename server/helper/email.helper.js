'use strict';
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const sendMail = {};

sendMail.send = (mailOptions) => {
  mailOptions.from = "houserentservice112@gmail.com"
  const options = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'houserentservice112@gmail.com',
      pass: 'houserent112!'
    }
  }
  const transporter = nodemailer.createTransport(smtpTransport(options))
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      throw error
    }
  });
};
module.exports = sendMail;
