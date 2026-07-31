const multer = require('multer');
const uuid = require('uuid');
const path = require('path');

const imagePath = req.userID.toString() + Date.now().toString() + uuid.v4().toString();


export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../files/posts/")
    },
    filename: (req, file, cb) => {
        const extName = path.extname(file.originalname)
        req.imagePath = imagePath + extName;
        cb(null, imagePath+extName)
    }
})

