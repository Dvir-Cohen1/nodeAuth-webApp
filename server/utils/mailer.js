import nodemailer from 'nodemailer'; // npm Package - npm i nodemailer

export async function sendEmail(to, subject, text, htmlTemplate, attachments = []) {
     // Generate test SMTP service account from ethereal.email
     // Only needed if you don't have a real mail account for testing
     const account = await nodemailer.createTestAccount();

     // // create reusable transporter object using the default SMTP transport
     const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
               user: account.user, // use "account.user" if needed
               pass: account.pass, // use "account.pass" if needed
          },
     });

     // // create reusable mail options object
     const mailOptions = {
          from: 'dvir906@gmail.com',
          to: to,
          subject: subject,
          text: text,
     };

     // // send email
     transporter.sendMail(mailOptions, (error, info) => {
          (error) ? console.log(error) : console.log(`Email sent:  + ${info.response}`);
     });
}
