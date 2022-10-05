const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ReviewModel = require('./reviewModel')

const PortalSchema = new Schema({
    author: String,
    country: String,
    imageLink: String,
    language: String,
    link: String,
    pages: Number,
    title: String,
    year: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'ReviewModel'
        }
    ]
});

PortalSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await ReviewModel.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('PortalModel', PortalSchema);