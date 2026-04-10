const check = async (req, res, next) => {
    const cookie = req.cookies?.jwt || req.headers['authorization'];
    
    if (!cookie) {
        return res.status(403).json({ "message": "unauthenticated" });
    }
    
    next();
}

module.exports = { check };

