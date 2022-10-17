const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    poster: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    }
});

module.exports = mongoose.model('ReviewModel', ReviewSchema);