const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = async () => {
     /* mongoose.connect(process.env.DATABASE_URI,
        { useUnifiedTopology: true ,useNewUrlParser: true},
        () => {
            console.log('gcvhmb')
        }
    ); */

    try {
        // mongoose.connect(process.env.DATABASE_URI);

        mongoose.connect(process.env.DATABASE_URI,
            { useNewUrlParser: true, useUnifiedTopology: true }
        );
    }
    catch (error) {
        console.log(error);
    }


}

module.exports = { connectDB };