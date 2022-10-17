const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsyncError = require('../utils/catchAsyncError');
const ExpressError = require('../utils/expressError');
const PortalModel = require('../models/portalModel'); // For handling PUT, PATCH and DELETE routes
const ReviewModel = require('../models/reviewModel')
const { reviewJoiSchema } = require('../joiSchemas');
const { model } = require('mongoose');
const { validateReview, isLoggedIn, isReviewPoster } = require('../middleware')


// Post a reviews
router.post('/', validateReview, isLoggedIn, catchAsyncError(async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id);
    const review = new ReviewModel(req.body.review);
    review.poster = req.user._id;
    portalDocument.reviews.push(review);
    await review.save();
    await portalDocument.save();
    req.flash('successMessage', 'Created a new review');
    res.redirect(`/portalDocuments/${portalDocument._id}`);
}))

// Delete reviews
router.delete('/:reviewId', isLoggedIn, isReviewPoster, catchAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await PortalModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await ReviewModel.findByIdAndDelete(reviewId);
    req.flash('successMessage', 'Succesffully Deleted the review');
    res.redirect(`/portalDocuments/${id}`);
}))

module.exports = router;