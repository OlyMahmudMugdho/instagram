const check = async (req, res, next) => {
    const cookie = req.cookies;
    if (!cookie && !cookie.jwt) {
        return res.status(403).json({ "message": "unauthenticated" });
    }
    next();
}

module.exports = { check };

