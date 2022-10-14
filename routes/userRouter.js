const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsyncError = require('../utils/catchAsyncError');
const UserModel = require('../models/userModel');

router.get('/register', (req, res) => {
    res.render('users/register');
});


router.post('/register', catchAsyncError(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const userDocument = new UserModel({ email, username });
        const registeredUserDocument = await UserModel.register(userDocument, password); // creates password for the userDocument
        console.log(registeredUserDocument)
        req.login(registeredUserDocument, err => {
            if (err) return next(err);
            req.flash('successMessage', 'Welcome to The Portals of Meaning');
            res.redirect('/portalDocuments');
        })
    } catch (e) {
        console.log(e)
        req.flash('errorMessage', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('successMessage', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/portalDocuments';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})




router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/portalDocuments");
    });
});

module.exports = router;