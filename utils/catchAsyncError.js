
// This catchAsyncError is a wrapper function that will be take in function, catch errors
// and then pass those error to the error handler

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}