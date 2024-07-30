require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectMongoDB = require('./config/db/mongodb');
const createError = require('http-errors');
const errorHandler = require('./api/v1/helpers/errorHandler');


const PORT = process.env.PORT || 3030;
const DBConnectionString = process.env.DB_CONNECTION_STRING;


//---------------- CONNECT DB ----------------
connectMongoDB(DBConnectionString);


//---------------- HANDLE CORS ERROR ----------------
app.use(cors());


//---------------- MIDDLEWARE GET INFO FROM CLIENT BY REQ.BODY ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//---------------- ROUTE ----------------
require('./api/v1/routes/web')(app);


//---------------- MIDDLEWARE ERROR HANDLING ----------------
app.use((req, res, next) =>{
    next(createError.NotFound);
});
app.use(errorHandler);


//---------------- CHECK SERVER START ----------------
app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`);
})