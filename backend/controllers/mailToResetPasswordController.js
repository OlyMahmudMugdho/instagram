const Users = require('../models/Users');
const sendMail = require('../configs/sendMail').send;
const crypto = require('crypto');
require('dotenv').config();

const mailToResetPassword = async (req, res) => {
    const email = req.body.email;

    if (!email) {
        return res.status(403).json(
            {
                error: true,
                message: "email field is empty"
            }
        )
    }

    const foundUser = await Users.findOne({ email: email });

    if (!foundUser) {
        return res.status(403).json({
            error: true,
            message: "No user found with this email"
        });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetCode = Math.floor(Math.random() * 999999) + 110000;

    foundUser.resetCode = resetCode;
    await foundUser.save();

    const emailContent = `Your verification code to reset your password is: <h2>${resetCode}</h2><br>If you did not request this, please ignore this email.`;

    try {
        await sendMail(email, emailContent);
        return res.status(200).json({
            success: true,
            message: "mail sent"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: "error from server"
        })
    }
}



module.exports = {
    mailToResetPassword
};