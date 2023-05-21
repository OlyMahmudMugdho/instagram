const checkUrl = (req, res, next) => {
    console.log(req.path);
    (req.path === '/posts') ? next() : res.sendStatus(404);
}
module.exports = { checkUrl };