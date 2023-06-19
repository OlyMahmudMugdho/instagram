const checkUrl = (req, res, next) => {
    (req.path === '/posts') ? next() : res.sendStatus(404);
}
module.exports = { checkUrl };