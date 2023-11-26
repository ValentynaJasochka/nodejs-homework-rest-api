const nodemailer = require("nodemailer");

require("dotenv").config();

const { META_PASSWORD } = process.env;

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "avadaketavra@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const emailOptions = { ...data, from: "avadaketavra@meta.ua" };

  await transport.sendMail(emailOptions);

  return true;
};

module.exports = sendEmail;
