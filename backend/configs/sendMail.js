const nodemailer = require('nodemailer');

const send = async (address, link) => {
    if (!address || !link) {
        throw new Error("Address and link are required");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_PORT === "465",
        auth: {
            user: process.env.EMAILID,
            pass: process.env.PASSWORDFORMAIL,
        }
    });

    const mailOptions = {
        from: 'instagram@pixl.com',
        to: address.toString(),
        subject: 'Reset Password',
        html: link, // The 'link' variable here contains the full HTML body
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    send
}