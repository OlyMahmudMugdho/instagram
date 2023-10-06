const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dbConnection = require('./configs/connectDB');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const credentials = require('./configs/credentials').credentials;
const mongoose = require('mongoose');
require('dotenv').config();
app.use('/files',express.static('./files'));

const PORT = process.env.PORT || 5000;

dbConnection.connectDB();


app.use(credentials)

app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = ['*', 'https://example.com'];
const corsConfig = {
    origin : 'http://localhost:5173,
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




app.get('/', (req, res) => {
    res.json(
        {
            "success": true
        }
    )
});

app.set("trust proxy",1);

app.use('/', require('./routes/posts'));
app.use('/', require('./routes/register'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/logOut'));
app.use('/', require('./routes/token'));
app.use('/', require('./routes/posts'));
app.use('/', require('./routes/likes'));
app.use('/', require('./routes/follow'));
app.use('/', require('./routes/comment'));
app.use('/', require('./routes/feed'));
app.use('/', require('./routes/resetPassword'));
app.use('/', require('./routes/users'));
app.use('/', require('./routes/search'));
app.use('/',require('./routes/helper'))

mongoose.connection.once(
    'open', () => {
        app.listen(PORT, (req, res) => {
            console.log('working server');
        })
    }
)

module.exports = app;