
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('errorMessage', 'You must be signed in first');
        res.redirect('/login');
    }
    next()

}

