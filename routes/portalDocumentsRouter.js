const express = require('express');
const router = express.Router();
const catchAsyncError = require('../utils/catchAsyncError');
const PortalModel = require('../models/portalModel'); // For handling PUT, PATCH and DELETE routes
const { isLoggedIn, validatePortalDocument, isPoster } = require('../middleware');
const portalDocController = require('../controllers/portalDocControllers')



router.route('/')
    // Retreiving portal documents from database
    .get(catchAsyncError(portalDocController.index))

    // Creating a new portal document
    .post(validatePortalDocument, isLoggedIn, catchAsyncError(portalDocController.createNewPortalDoc))

//portal document form
router.get('/new', isLoggedIn, portalDocController.renderNewForm)

router.route('/:id')

    // Showing individual portal document
    .get(catchAsyncError(portalDocController.showPortalDoc))

    // Updating a portal document
    .put(isLoggedIn, isPoster, validatePortalDocument, catchAsyncError(portalDocController.updatePortalDoc))

    // Deleting a portal document
    .delete(isLoggedIn, isPoster, isLoggedIn, catchAsyncError(portalDocController.deletePortalDoc))

// Editing a portal document
router.get('/:id/edit', isLoggedIn, isPoster, catchAsyncError(portalDocController.renderEditForm))


module.exports = router;