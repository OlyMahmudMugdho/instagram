const Users = require('../models/Users');

const reset = async (req,res) => {
    const email = req.body.email;
    const newPassword = req.body.newPassword;
    const recheck = req.body.recheck;

    if(!email || !newPassword || !recheck) {
        return res.status(404).json({
            error : true,
            message : "fields are empty"
        });
    }

    if(newPassword !== recheck) { 
        return res.status(403).json({
            error : true,
            message : "didn't matched"
        });
    }

    const foundUser = await Users.findOne({email : email});
    
    if(!foundUser) {
        return res.status(404).json({
            error : true,
            message : "user not found"
        });
    }

    try {
        foundUser.password = newPassword;
        await foundUser.save();
        return res.status(200).json({
            success : true,
            message : "password changed"
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error : true,
            message : "error from server"
        });
    }

}

module.exports = {
    reset
}