const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsyncError = require('../utils/catchAsyncError');
const ExpressError = require('../utils/expressError');
const PortalModel = require('../models/portalModel'); // For handling PUT, PATCH and DELETE routes
const ReviewModel = require('../models/reviewModel')
const { reviewJoiSchema } = require('../joiSchemas');
const { model } = require('mongoose');



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


// Post a reviews
router.post('/', validateReview, catchAsyncError(async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id);
    const review = new ReviewModel(req.body.review);
    portalDocument.reviews.push(review);
    await review.save();
    await portalDocument.save();
    res.redirect(`/portalDocuments/${portalDocument._id}`);
}))

// Delete reviews
router.delete('/:reviewId', catchAsyncError(async (req, res) => {
    const { id, reviewId } = req.params;
    await PortalModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await ReviewModel.findByIdAndDelete(reviewId);
    res.redirect(`/portalDocuments/${id}`);
}))

module.exports = router;