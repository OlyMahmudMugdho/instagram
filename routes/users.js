const router = require('express').Router();
const checkJWT = require('../middlewares/checkJWT');
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const getPaginatedUsersController = require("../controllers/getPaginatedUsersController");
const getRandomUsersController = require("../controllers/getRandomUsersController");
const setProfilePictureController = require("../controllers/setProfilePictureController");
const multer = require('multer');
const path = require('path');
const uuid = require('uuid');
const editProfileController = require('../controllers/editProfileController');
const getSingleUserController = require('../controllers/getSingleUserController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files/profile-pictures')
    },
    filename: (req, file, cb) => {
        const extName = path.extname(file.originalname);
        const imageName = Date.now() + uuid.v4() + extName;
        req.profilePic = "http://localhost:5000/files/profile-pictures/" + imageName;
        cb(null, imageName);
    }
})

const upload = multer({ storage: storage });

router.route('/users')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, getRandomUsersController.getRandomUsers)

router.route('/users/:userID')
    .get(checkJWT.check, verifyAccessToken.verifyAccess,getSingleUserController.getSingleUser)

router.route('/users/:page')
    .get(checkJWT.check, verifyAccessToken.verifyAccess, getPaginatedUsersController.getUsers);

router.route('/users/profile/picture')
    .put(checkJWT.check, verifyAccessToken.verifyAccess, upload.single('image'), setProfilePictureController.setProfilePicture)

router.route('/users/profile/edit')
    .put(checkJWT.check, verifyAccessToken.verifyAccess, editProfileController.editProfile)



module.exports = router;