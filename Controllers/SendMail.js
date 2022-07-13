const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { OAuth2 } = google.auth;
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const {
  MAILING_SERVICE_CLIENT_ID,
  MAILING_SERVICE_CLIENT_SECRET,
  MAILING_SERVICE_REFRESH_TOKEN,
  SENDER_EMAIL_ADDRESS,
} = process.env;

const oauth2Client = new OAuth2(
  "956215458999-ht0321kvmidil99h0nhq83f72mm7s36u.apps.googleusercontent.com",
  "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",
  "1//045iIDrJuXbUqCgYIARAAGAQSNwF-L9IrowiHSxjgYkuaJYHRA2J7xtXIBAggZDVUmNa8OzU9wJOkn8riRraaT18QLKteM7Minvg",
  OAUTH_PLAYGROUND
);

// send mail
const sendEmail = (to, url, txt) => {
  oauth2Client.setCredentials({
    refresh_token:
      "1//045iIDrJuXbUqCgYIARAAGAQSNwF-L9IrowiHSxjgYkuaJYHRA2J7xtXIBAggZDVUmNa8OzU9wJOkn8riRraaT18QLKteM7Minvg",
  });

  const accessToken = oauth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "canadawolmart@gmail.com",
      clientId:
        "956215458999-ht0321kvmidil99h0nhq83f72mm7s36u.apps.googleusercontent.com",
      clientSecret: "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",
      refreshToken:
        "1//045iIDrJuXbUqCgYIARAAGAQSNwF-L9IrowiHSxjgYkuaJYHRA2J7xtXIBAggZDVUmNa8OzU9wJOkn8riRraaT18QLKteM7Minvg",
      accessToken,
    },
  });

  const mailOptions = {
    from: "canadawolmart@gmail.com",
    to: to,
    subject: "Wolmart",
    html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the DevAT channel.</h2>
            <p>Congratulations! You're almost set to start using DEVAT✮SHOP.
                Just click the button below to validate your email address.
            </p>
            
            <a href=${url} style="background: crimson; text-decoration: none; color: white; padding: 10px 20px; margin: 10px 0; display: inline-block;">${txt}</a>
        
            <p>If the button doesn't work for any reason, you can also click on the link below:</p>
        
            <div>${url}</div>
            </div>
        `,
  };

  smtpTransport.sendMail(mailOptions, (err, infor) => {
    if (err) return err;
    return infor;
  });
};

module.exports = sendEmail;
