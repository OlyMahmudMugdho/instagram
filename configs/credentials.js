
const credentials = (req,res,next) => {
    res.header('Access-Control-Alllow-Credentials',true);
    next();
}

module.exports = {
    credentials
}