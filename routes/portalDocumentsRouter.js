const express = require('express');
const router = express.Router();
const catchAsyncError = require('../utils/catchAsyncError');
const PortalModel = require('../models/portalModel'); // For handling PUT, PATCH and DELETE routes
const { isLoggedIn, validatePortalDocument, isPoster } = require('../middleware');



// Retreiving portal documents from database
router.get('/', catchAsyncError(async (req, res) => {
    const portalDocuments = await PortalModel.find({});
    res.render('portalDocuments/index', { portalDocuments })
}))

//portal document form
router.get('/new', isLoggedIn, (req, res) => {
    res.render('portalDocuments/new');
})

// Creating a new portal document
router.post('/', validatePortalDocument, isLoggedIn, catchAsyncError(async (req, res) => {
    const portalDocument = new PortalModel(req.body.portalDocument);
    portalDocument.poster = req.user._id;
    await portalDocument.save()
    req.flash('successMessage', 'Horay!! You just created a Portal!');
    res.redirect(`/portalDocuments/${portalDocument._id}`)
}))

// Showing individual portal document
router.get('/:id', catchAsyncError(async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id).populate({
        path: 'reviews',      // populate reviews
        populate: {
            path: 'poster'     // populate the poster username for that review
        }
    }).populate('poster');     // popuate different posters
    console.log(portalDocument.poster);
    if (!portalDocument) {
        req.flash('errorMessage', 'Cannot find that the Portal');
        return res.redirect('/portalDocuments')
    }
    res.render('portalDocuments/show', { portalDocument })
}))

// Editing a portal document
router.get('/:id/edit', isLoggedIn, isPoster, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const portalDocument = await PortalModel.findById(id);
    // Checking to see if the portal document that you request exist
    if (!portalDocument) {
        req.flash('errorMessage', 'Cannot find that the Portal');
        return res.redirect('/portalDocuments')
    }

    res.render('portalDocuments/edit', { portalDocument })
}))

// Updating a portal document
router.put('/:id', isLoggedIn, isPoster, validatePortalDocument, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const portalDocument = await PortalModel.findByIdAndUpdate(id, { ...req.body.portalDocument });
    res.redirect(`/portalDocuments/${portalDocument._id}`)
}))

// Deleting a portal document
router.delete('/:id', isLoggedIn, isPoster, isLoggedIn, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    await PortalModel.findByIdAndDelete(id);
    req.flash('successMessage', 'Succeffully deleted that Portal');
    res.redirect('/portalDocuments');
}))

module.exports = router;