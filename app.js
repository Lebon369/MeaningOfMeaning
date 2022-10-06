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


mongoose.connect('mongodb://localhost:27017/meaning-of-meaning');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

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

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', pathFinder.join(__dirname, 'views'));

// Parsing the new (portal document) input
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use('/portalDocuments', portalDocRouter);
app.use('/portalDocuments/:id/reviews', reviewsRouter);
app.use(express.static(pathFinder.join(__dirname, 'public')));
app.use(session(sessionConfig));





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