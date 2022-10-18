const { model } = require('mongoose');
const PortalModel = require('../models/portalModel'); // For handling PUT, PATCH and DELETE routes



module.exports.index = async (req, res) => {
    const portalDocuments = await PortalModel.find({});
    res.render('portalDocuments/index', { portalDocuments })
}

module.exports.renderNewForm = (req, res) => {
    res.render('portalDocuments/new');
}

module.exports.createNewPortalDoc = async (req, res) => {
    const portalDocument = new PortalModel(req.body.portalDocument);
    portalDocument.poster = req.user._id;
    await portalDocument.save()
    req.flash('successMessage', 'Horay!! You just created a Portal!');
    res.redirect(`/portalDocuments/${portalDocument._id}`)
}

module.exports.showPortalDoc = async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id).populate({
        path: 'reviews',      // populate reviews
        populate: {
            path: 'poster'     // populate the poster username for that review
        }
    }).populate('poster');     // popuate different posters

    if (!portalDocument) {
        req.flash('errorMessage', 'Cannot find that the Portal');
        return res.redirect('/portalDocuments')
    }
    res.render('portalDocuments/show', { portalDocument })
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const portalDocument = await PortalModel.findById(id);
    // Checking to see if the portal document that you request exist
    if (!portalDocument) {
        req.flash('errorMessage', 'Cannot find that the Portal');
        return res.redirect('/portalDocuments')
    }

    res.render('portalDocuments/edit', { portalDocument })
}


module.exports.updatePortalDoc = async (req, res) => {
    const { id } = req.params;
    const portalDocument = await PortalModel.findByIdAndUpdate(id, { ...req.body.portalDocument });
    res.redirect(`/portalDocuments/${portalDocument._id}`)
}


module.exports.deletePortalDoc = async (req, res) => {
    const { id } = req.params;
    await PortalModel.findByIdAndDelete(id);
    req.flash('successMessage', 'Succeffully deleted that Portal');
    res.redirect('/portalDocuments');
}