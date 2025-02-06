const { createTransport } = require("nodemailer");

const sendApproveAccount = async (email, name, OTP) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Approval Required</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #eee5da;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    color: #679089;
                }
                h3 {
                    color: #f18966;
                }
                h2 {
                    color: #f18966;
                }
                p {
                    line-height: 1.5;
                }
                a {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #679089;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 4px;
                }
                a:hover {
                    background-color: #557b6d;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Hello, ${name}!</h1>
                <p>We need your confirmation to approve your account registration.</p>
                <p>Please input the otp below to approve your account and complete the setup process: </p>
                <p>If you did not request this or have any questions, feel free to contact our support team.</p>
                <p style="font-style: italic;">Best regards,</p>
                <h2>Your OTP: ${OTP}</h2>
                <h3>Etutor CO.,LTD</h3>
            </div>
        </body>
        </html>
    `;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject: "Account Approval Required",
    html,
  });
};

const sendForgotPassword = async (email, name, OTP) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });
  const html = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Your verify code</title>
          <style>
              body{
                  font-family: Arial, san-serif;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }
              .container{
                  background-color: #eee5da;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
               h1{
                  color: #679089;
               }
               p{
                  margin-bottom: 20px;
               }
               .otp{
                  font-size: 36px;
                  color: #f18966;
                  margin-bottom: 30px;
               }
          </style>
        </head>
        <body>
         <div class="container">
          <h1>New Password</h1>
          <p>Hello ${name} your verify code for reset password is:</p>
          <p class="Password" style="color: #f18966; font-weigth: bold;">${OTP}</p>
         </div>
        </body>
      </html>
      `;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject: subject,
    html,
  });
};

const sendAcceptClass = async (emailStudent, emailTutor, className) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Class Acceptance Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #eee5da;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #679089;
            }
            p {
                margin-bottom: 20px;
            }
            .class-name {
                font-size: 20px;
                font-weight: bold;
                color: #f18966;
            }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Class Accepted</h1>
          <p>Dear student and tutor,</p>
          <p>The class <span class="class-name">${className}</span> has been accepted successfully.</p>
          <p>We wish you a great learning experience!</p>
        </div>
      </body>
    </html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: [emailStudent, emailTutor], // Gửi email đến cả hai người
    subject: `Class Acceptance Notification - ${className}`,
    html,
  });
};

const sendUpdateClass = async (
  emailStudent,
  emailTutor,
  className,
  message
) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const html = `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Class Update Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #eee5da;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #679089;
            }
            p {
                margin-bottom: 15px;
            }
            .class-name {
                font-size: 20px;
                font-weight: bold;
                color: #f18966;
            }
            .message {
                font-style: italic;
                color: #333;
                background-color: #fff;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                display: inline-block;
            }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Class Update</h1>
          <p>Dear Student and Tutor,</p>
          <p>The class <span class="class-name">${className}</span> has been updated with the following changes:</p>
          <p class="message">${message}</p>
          <p>Please review the updates and take necessary actions if required.</p>
          <p>Best regards,</p>
          <p>The Support Team</p>
        </div>
      </body>
    </html>`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: [emailStudent, emailTutor], // Gửi cho cả học viên và gia sư
    subject: `Update on Your Class: ${className}`,
    html,
  });
};

const sendFinishClass = async (emailStudent, emailTutor, className) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.Gmail,
      pass: process.env.Password,
    },
  });

  const subject = `Class ${className} has been successfully completed!`;

  const html = (name, role) => `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Class Completion</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background-color: #f4f4f4;
              }
              .container {
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                text-align: center;
              }
              h1 {
                color: #4CAF50;
              }
              p {
                font-size: 16px;
                color: #333;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Congratulations!</h1>
              <p>Hello <b>${name}</b>,</p>
              <p>Your class "<b>${className}</b>" has now been successfully completed.</p>
              <p>Thank you for your dedication and hard work as a ${role}.</p>
              <p>We hope you had a great experience and look forward to seeing you in future classes!</p>
            </div>
          </body>
        </html>
      `;

  // Send email to Student
  await transporter.sendMail({
    from: process.env.Gmail,
    to: emailStudent,
    subject,
    html: html("Student", "student"),
  });

  // Send email to Tutor
  await transporter.sendMail({
    from: process.env.Gmail,
    to: emailTutor,
    subject,
    html: html("Tutor", "tutor"),
  });

  console.log("Class completion emails sent successfully.");
};

module.exports = {
  sendApproveAccount,
  sendForgotPassword,
  sendAcceptClass,
  sendUpdateClass,
  sendFinishClass,
};
