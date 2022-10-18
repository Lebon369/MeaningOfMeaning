const UserModel = require('../models/userModel');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register');
}

module.exports.UserRegister = async (req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.UserLogin = (req, res) => {
    req.flash('successMessage', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/portalDocuments';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/portalDocuments");
    });
}