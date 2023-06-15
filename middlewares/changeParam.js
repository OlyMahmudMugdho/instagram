const router = require('express').Router();


const change = () => {
    router.param('name', (req, res, next, name) => {
        req.name = name;
        module.exports = {
            router
        }
        next()
    })
}

module.exports = {
    change
}