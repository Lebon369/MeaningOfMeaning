// imports
const express = require('express');
const { default: mongoose } = require('mongoose');
const ejsMate = require('ejs-mate');
const pathFinder = require('path');
const PortalModel = require('./models/portalModel'); // For handling PUT, PATCH and DELETE routes
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/meaning-of-meaning');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', pathFinder.join(__dirname, 'views'));

// Parsing the new (portal document) input
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// get and respond to the requests from the homepage
app.get('/', (req, res) => {
    res.render('home')
})

// Retreiving portal documents from database
app.get('/portalDocuments', async (req, res) => {
    const portalDocuments = await PortalModel.find({});
    res.render('portalDocuments/index', { portalDocuments })
})

// portal document form 
app.get('/portalDocuments/new', (req, res) => {
    res.render('portalDocuments/new');
})

// Posting a new portal document
app.post('/portalDocuments', async (req, res) => {
    const portalDocument = new PortalModel(req.body.portalDocument)
    await portalDocument.save()
    res.redirect(`/portalDocuments/${portalDocument._id}`)
})

// Showing individual portal document
app.get('/portalDocuments/:id', async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id);
    res.render('portalDocuments/show', { portalDocument })
})

// Editing a portal document
app.get('/portalDocuments/:id/edit', async (req, res) => {
    const portalDocument = await PortalModel.findById(req.params.id);
    res.render('portalDocuments/edit', { portalDocument })
})

// Faking put request with method override in edit.ejs
app.put('/portalDocuments/:id', async (req, res) => {
    const { id } = req.params;
    const portalDocument = await PortalModel.findByIdAndUpdate(id, { ...req.body.portalDocument });
    res.redirect(`/portalDocuments/${portalDocument._id}`)
})

// Deleting a portal document
app.delete('/portalDocuments/:id', async (req, res) => {
    const { id } = req.params;
    await PortalModel.findByIdAndDelete(id);
    res.redirect('/portalDocuments');
})


//The communication port
app.listen(3000, () => {
    console.log(' Communicating through port 3000')
})