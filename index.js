const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const bodyParser = require('body-parser')
const logger = require("morgan");


const userRoutes = require('./routes/userRoutes');
const globalErrHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
dotenv.config({
    path: './config.env'
});


const app = express();

// Allow Cross-Origin requests
app.use(cors());

// Set security HTTP headers
app.use(helmet());
app.use(logger('dev'))
app.use(bodyParser.json());
// const userRoute = require('./routes/userRoutes')
const authRoute = require('./routes/auth.routes')
// app.use('/api', userRoute)
app.use('/api', authRoute)



process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION!!! shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});


const database = "mongodb://127.0.0.1:27017/api_nodejs_l ";

// Connect the database
mongoose.connect(database).then(con => {
    console.log('DB connection Successfully!');
});

// // Start the server
// const port = process.env.PORT;
// app.listen(port, () => {
//     console.log(`Application is running on port ${port}`);
// });

process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION!!!  shutting down ...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log("Server is running...");
})

app.use( express.json() );
app.get("/",(req,res)=>{
    res.send('done')

    app.use(express.json({
        limit: '15kb'
    }));
    
    // Data sanitization against Nosql query injection
    app.use(mongoSanitize());
    
    // Data sanitization against XSS(clean user input from malicious HTML code)
    app.use(xss());
    
    // Prevent parameter pollution
    app.use(hpp());
    
    
    // Routes
    //app.use('/api/v1/users', userRoutes);
    
    // handle undefined Routes
    app.use('*', (req, res, next) => {
        const err = new AppError(404, 'fail', 'undefined route');
        next(err, req, res, next);
    });
    
    app.use(globalErrHandler);
});