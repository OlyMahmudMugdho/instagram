const nodemailer = require('nodemailer');

const send = async (req,res,address,link) => {
    if(!address || !link) {
        return 
    }
    
    const transporter = await nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
            port: 587,
            auth: {
                user: process.env.EMAILID,
                pass: process.env.PASSWORDFORMAIL,
            }
    });

    const mailOptions =  {
        from : 'instagram@pixl.com',
        to : address.toString(),
        subject : 'Reset Password',
        text : `Click this link to reset password ${link}`,
    }

    await transporter.sendMail(mailOptions, (err,info) => {
        if(err) {
            console.log(err);
            return res.status(500).json(
                {
                    error : true,
                    message : "an error occured from server"
                }
            );
        }
        
        console.log(info)

        return res.status(200).json({
            message : "reset password mail sent",
            info : info
        });
    });
}

module.exports = {
    send
}