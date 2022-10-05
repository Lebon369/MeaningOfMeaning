// imports
const express = require('express');
const { default: mongoose } = require('mongoose');
const ejsMate = require('ejs-mate');
const pathFinder = require('path');
const PortalModel = require('./models/portalModel'); // For handling PUT, PATCH and DELETE routes
const methodOverride = require('method-override');
const catchAsyncError = require('./utils/catchAsyncError');
const ExpressError = require('./utils/expressError');
const ReviewModel = require('./models/reviewModel')
const { portalDocumentJoiSchema, reviewJoiSchema } = require('./joiSchemas')


mongoose.connect('mongodb://localhost:27017/meaning-of-meaning');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', pathFinder.join(__dirname, 'views'));

// Parsing the new (portal document) input
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Creating validation for portal documents with Joi
const validatePortalDocument = (req, res, next) => {
    const { error } = portalDocumentJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Creating validation for reviews
const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// get and respond to the requests from the homepage
app.get('/', (req, res) => {
    res.render('home')
})

// Retreiving portal documents from database
app.get('/portalDocuments', catchAsyncError(async (req, res) => {
    const portalDocuments = await PortalModel.find({});
    res.render('portalDocuments/index', { portalDocuments })
}))

// portal document form 
app.get('/portalDocuments/new', (req, res) => {
    res.render('portalDocuments/new');
})

// Posting a new portal document
app.post('/portalDocuments', validatePortalDocument, catchAsyncError(async (req, res) => {
    const portalDocument = new PortalModel(req.body.portalDocument)
    await portalDocument.save()
    res.redirect(`/portalDocuments/${portalDocument._id}`)
}))

// Showing individual portal document
app.get('/portalDocuments/:id', catchAsyncError(async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id).populate('reviews');
    res.render('portalDocuments/show', { portalDocument })
}))

// Editing a portal document
app.get('/portalDocuments/:id/edit', catchAsyncError(async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id);
    res.render('portalDocuments/edit', { portalDocument })
}))

// Faking put request with method override in edit.ejs
app.put('/portalDocuments/:id', validatePortalDocument, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const portalDocument = await PortalModel.findByIdAndUpdate(id, { ...req.body.portalDocument });
    res.redirect(`/portalDocuments/${portalDocument._id}`)
}))

// Deleting a portal document
app.delete('/portalDocuments/:id', catchAsyncError(async (req, res) => {
    const { id } = req.params;
    await PortalModel.findByIdAndDelete(id);
    res.redirect('/portalDocuments');
}))

// Add reviews
app.post('/portalDocuments/:id/reviews', validateReview, catchAsyncError(async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id);
    const review = new ReviewModel(req.body.review);
    portalDocument.reviews.push(review);
    await review.save();
    await portalDocument.save();
    res.redirect(`/portalDocuments/${portalDocument._id}`);
}))

// Dekete reviews
app.delete('/portalDocuments/:id/reviews/:reviewId', catchAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await PortalModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await ReviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/portalDocuments/${id}`);
}))

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