const nodemailer = require('nodemailer');

function createMailer(config) {
  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.password,
    },
  });

  return {
    async send({ to, cc = [], subject, text }) {
      return transporter.sendMail({
        from: config.smtp.from,
        to,
        cc,
        subject,
        text,
      });
    },
    async verify() {
      return transporter.verify();
    },
  };
}

module.exports = { createMailer };
