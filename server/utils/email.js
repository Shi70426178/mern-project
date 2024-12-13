const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ruthe97@ethereal.email',
            pass: 'BUrgdGpEhkNUcz4fjc'
        }
    });

    const mailOptions = {
        from: 'no-reply@yourapp.com', // The from address can be anything since it's for testing
        to: options.email,
        subject: options.subject,
        text: options.message,
        attachments: options.attachments
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
