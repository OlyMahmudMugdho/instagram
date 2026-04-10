
const credentials = (req,res,next) => {
    res.header('Access-Control-Alllow-Credentials',true);
    res.header('Access-Control-Allow-Origin',true) ,
    res.header('Access-Control-Allow-Methods',true),
    res.header('Access-Control-Allow-Headers',true)
    next();
}

module.exports = {
    credentials
}