const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsyncError = require('../utils/catchAsyncError');
const ExpressError = require('../utils/expressError');
const PortalModel = require('../models/portalModel'); // For handling PUT, PATCH and DELETE routes
const ReviewModel = require('../models/reviewModel');
const { reviewJoiSchema } = require('../joiSchemas');
const { model } = require('mongoose');
const { validateReview, isLoggedIn, isReviewPoster } = require('../middleware');
const reviewController = require('../controllers/reviewControllers');


// Post a reviews
router.post('/', validateReview, isLoggedIn, catchAsyncError(reviewController.createReview))

// Delete reviews
router.delete('/:reviewId', isLoggedIn, isReviewPoster, catchAsyncError(reviewController.deleteReview))

module.exports = router;