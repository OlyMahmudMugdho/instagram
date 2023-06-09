const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const dbConnection = require('./configs/connectDB');
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

dbConnection.connectDB();

app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = ['*', 'https://example.com'];
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

app.get('/', (req, res) => {
    res.json(
        {
            "success": true
        }
    )
});



app.use('/', require('./routes/posts'));
app.use('/', require('./routes/register'));
app.use('/', require('./routes/login'));
app.use('/', require('./routes/logOut'));
app.use('/', require('./routes/token'));
app.use('/', require('./routes/posts'));
app.use('/', require('./routes/likes'));
app.use('/', require('./routes/follow'));
app.use('/', require('./routes/comment'));

mongoose.connection.once(
    'open', () => {
        app.listen(PORT, (req, res) => {
            console.log('working server');
        })
    }
)
