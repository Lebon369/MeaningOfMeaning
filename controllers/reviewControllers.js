const PortalModel = require('../models/portalModel');
const ReviewModel = require('../models/reviewModel');

module.exports.createReview = async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id);
    const review = new ReviewModel(req.body.review);
    review.poster = req.user._id;
    portalDocument.reviews.push(review);
    await review.save();
    await portalDocument.save();
    req.flash('successMessage', 'Created a new review');
    res.redirect(`/portalDocuments/${portalDocument._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await PortalModel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await ReviewModel.findByIdAndDelete(reviewId);
    req.flash('successMessage', 'Succesffully Deleted the review');
    res.redirect(`/portalDocuments/${id}`);
}