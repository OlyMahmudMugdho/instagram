const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
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

app.use('/',require('./routes/posts'));
app.use('/',require('./routes/register'));
app.use('/',require('./routes/login'));
app.use('/',require('./routes/logOut'));
app.use('/',require('./routes/token'));

app.listen(5000, (err) => {
    (err) ? console.log(err) : console.log('working server');
})