// imports
const express = require('express');
const { default: mongoose } = require('mongoose');
const ejsMate = require('ejs-mate');
const pathFinder = require('path');
const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');
const portalDocRouter = require('./routes/portalDocumentsRouter');
const reviewsRouter = require('./routes/reviewsRouter');
const session = require('express-session');
const flash = require('connect-flash')
const passport = require('passport');
const localPassport = require('passport-local');
const UserModel = require('./models/userModel');
const userRouter = require('./routes/userRouter');


// Establishing databse connection
mongoose.connect('mongodb://localhost:27017/meaning-of-meaning');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// Establish sessions
const sessionConfig = {
    secret: 'ibanga',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7

    }
};


const app = express();

// Configuration of the express app
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', pathFinder.join(__dirname, 'views'));

// app midlewares 

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(pathFinder.join(__dirname, 'public')));
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localPassport(UserModel.authenticate()));
passport.serializeUser(UserModel.serializeUser());          // Getting a user in a session
passport.deserializeUser(UserModel.deserializeUser());      // Getting a user out of a session

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('successMessage');
    res.locals.error = req.flash('errorMessage');
    next();
})




app.use('/', userRouter);
app.use('/portalDocuments', portalDocRouter);
app.use('/portalDocuments/:id/reviews', reviewsRouter);


// get and respond to the requests from the homepage
app.get('/', (req, res) => {
    res.render('home')
})


// Add the basic 404 error for invalid url requests by using the ExpressError class
// Every single request will have to pass through here to make sure the request is valid
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


// Error handler
// It takes in the error caught by the catchAsyncError function
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'There is an error!'
    res.status(statusCode).render('error', { err })
})

//The communication port
app.listen(3000, () => {
    console.log(' Communicating through port 3000')
})