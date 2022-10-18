const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsyncError = require('../utils/catchAsyncError');
const UserModel = require('../models/userModel');
const userController = require('../controllers/userControllers')

router.route('/register')
    .get(userController.renderRegisterForm)
    .post(catchAsyncError(userController.UserRegister))

router.route('/login')
    .get(userController.renderLoginForm)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.UserLogin)

router.get("/logout", userController.userLogout);

module.exports = router;