const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dbConnection = require('./configs/connectDB');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const credentials = require('./configs/credentials').credentials;
const mongoose = require('mongoose');
var cloudinary = require('cloudinary').v2

require('./configs/env');

app.use('/files', express.static(path.resolve(__dirname, 'files')));
const frontendDistPath = path.resolve(__dirname, 'dist');

const PORT = process.env.PORT || 5000;

dbConnection.connectDB();

// Serve static frontend from backend/dist
app.use(express.static(frontendDistPath));

app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = ['*'];
const corsConfig = {
    credentials: true,
    origin: (origin, callback) => {
        if (corsOptions[0] === '*' || corsOptions.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Blocked by me"));
        }
    }
};

app.use(cors(corsConfig));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use('/api/friends', require('./routes/friends'));
app.use('/api', require('./routes/posts'));
app.use('/api', require('./routes/register'));
app.use('/api', require('./routes/login'));
app.use('/api', require('./routes/logOut'));
app.use('/api', require('./routes/token'));
app.use('/api', require('./routes/likes'));
app.use('/api', require('./routes/follow'));
app.use('/api', require('./routes/comment'));
app.use('/api', require('./routes/feed'));
app.use('/api', require('./routes/resetPassword'));
app.use('/api', require('./routes/usersMe'));
app.use('/api', require('./routes/users'));
app.use('/api/search', require('./routes/search'));
app.use('/api/suggestions', require('./routes/suggestions'));
app.use('/api', require('./routes/helper'))

// SPA fallback for non-API, non-file routes
app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api') || req.url.startsWith('/files')) {
        return next();
    }

    if (path.extname(req.url)) {
        return next();
    }

    res.sendFile(path.resolve(frontendDistPath, 'index.html'));
});

// Explicit 404 handler
app.use((req, res) => {
    res.status(404).send('Not Found');
});

mongoose.connection.once(
    'open', () => {
        app.listen(PORT, (req, res) => {
            console.log('working server');
        })
    }
)

module.exports = app;
