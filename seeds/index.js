const mongoose = require('mongoose');
const books = require('./books');
const PortalModel = require('../models/portalModel');

mongoose.connect('mongodb://localhost:27017/meaning-of-meaning');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(" Seed Database connected");
});

// const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    // Clean the database befoe seeding
    await PortalModel.deleteMany({});

    // lets just work with 30 random books
    for (let i = 0; i < 30; i++) {
        const random100 = Math.floor(Math.random() * 100);
        const portalDocument = new PortalModel()
        const book = books[random100]
        portalDocument.title = book.title;
        portalDocument.author = book.author;
        portalDocument.year = book.year;
        portalDocument.country = book.country;
        portalDocument.language = book.language;
        portalDocument.pages = book.pages;
        portalDocument.poster = '6348c7e6e3f8e83282778801';

        // setting up image generator from source.unsplash.com
        portalDocument.imageLink = 'https://source.unsplash.com/collection/1971015';

        await portalDocument.save();
    }

}

seedDB().then(() => {
    mongoose.connection.close();
})