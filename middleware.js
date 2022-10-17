const ExpressError = require('./utils/expressError');
const { portalDocumentJoiSchema, reviewJoiSchema } = require('./joiSchemas');
const PortalModel = require('./models/portalModel');
const reviewModel = require('./models/reviewModel');


// Logging in check 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('errorMessage', 'You must be signed in first');
        res.redirect('/login');
    }
    next()

}


// Validation of portal documents with Joi
module.exports.validatePortalDocument = (req, res, next) => {
    const { error } = portalDocumentJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

// Posting a portal document authorization check
module.exports.isPoster = async (req, res, next) => {
    const { id } = req.params;                             // We take the id from the URL 
    const portalDocument = await PortalModel.findById(id); // We look up the portal document with that id

    // Checking to see if you own that portal document that you are requesting to edit
    if (!portalDocument.poster.equals(req.user._id)) {     // We check if the poster id is the same as the user id 
        req.flash('errorMessage', 'You do not have permission to do that!');
        return res.redirect(`/portalDocuments/${id}`);
    }
    next();
}

// Posting a review Authorization check
module.exports.isReviewPoster = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const reviewDocument = await reviewModel.findById(reviewId);
    if (!reviewDocument.poster.equals(req.user._id)) {
        req.flash('errorMessage', 'You do not have permission to do that!');
        return res.redirect(`/portalDocuments/${id}`);
    }
    next();
}

//  Checking validation for reviews
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}