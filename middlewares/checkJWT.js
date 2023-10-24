const check = async (req, res, next) => {
    // const cookie = req.cookies;
    const cookie = req.headers['authorization'];
    
    if (!cookie && !cookie.jwt) {
        return res.status(403).json({ "message": "unauthenticated" });
    }
    
    /*
        if (!cookie && !cookie.jwt) {
        return res.status(403).json({ "message": "unauthenticated" });
    }
    
    */
    next();
}

module.exports = { check };

