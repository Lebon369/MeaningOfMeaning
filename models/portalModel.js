const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortalSchema = new Schema({
    author: String,
    country: String,
    imageLink: String,
    language: String,
    link: String,
    pages: Number,
    title: String,
    year: String,
});

module.exports = mongoose.model('PortalModel', PortalSchema);