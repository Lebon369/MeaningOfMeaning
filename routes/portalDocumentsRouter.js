const express = require('express');
const router = express.Router();
const catchAsyncError = require('../utils/catchAsyncError');
const ExpressError = require('../utils/expressError');
const PortalModel = require('../models/portalModel'); // For handling PUT, PATCH and DELETE routes
const { portalDocumentJoiSchema } = require('../joiSchemas');
const { isLoggedIn } = require('./middleware')



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
router.post('/', isLoggedIn, validatePortalDocument, isLoggedIn, catchAsyncError(async (req, res) => {
    const portalDocument = new PortalModel(req.body.portalDocument)
    await portalDocument.save()
    req.flash('successMessage', 'Horay!! You just created a Portal!');
    res.redirect(`/portalDocuments/${portalDocument._id}`)
}))

// Showing individual portal document
router.get('/:id', isLoggedIn, catchAsyncError(async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id).populate('reviews');
    if (!portalDocument) {
        req.flash('errorMessage', 'Cannot find that the Portal');
        return res.redirect('/portalDocuments')
    }
    res.render('portalDocuments/show', { portalDocument })
}))

// Editing a portal document
router.get('/:id/edit', isLoggedIn, catchAsyncError(async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id);
    if (!portalDocument) {
        req.flash('errorMessage', 'Cannot find that the Portal');
        return res.redirect('/portalDocuments')
    }
    res.render('portalDocuments/edit', { portalDocument })
}))

// Updating a portal document
router.put('/:id', isLoggedIn, validatePortalDocument, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    const portalDocument = await PortalModel.findByIdAndUpdate(id, { ...req.body.portalDocument });
    res.redirect(`/portalDocuments/${portalDocument._id}`)
}))

// Deleting a portal document
router.delete('/:id', isLoggedIn, isLoggedIn, catchAsyncError(async (req, res) => {
    const { id } = req.params;
    await PortalModel.findByIdAndDelete(id);
    req.flash('successMessage', 'Succeffully deleted that Portal');
    res.redirect('/portalDocuments');
}))

module.exports = router;