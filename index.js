// Importing required modules
const express = require('express'); // Importing Express.js
const path = require('path'); // Importing Path module
const port = 8000; // Declaring the server port

const db = require('./config/mongoose');
const Contact = require('./models/contact');

// Initializing Express app
const app = express();

// Setting view engine to use EJS
app.set('view engine', 'ejs');

// Setting views directory
app.set('views', path.join(__dirname, 'views'));

// Using middleware to parse form data and serve static assets
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(express.static('assets')); // Serving static assets from the 'assets' directory

// Middleware to log request received time
app.use(function(req, res, next){
    console.log(`Request received at ${new Date()}`);
    next();
});

// Handling GET request for the root URL '/'
app.get('/', function(req, res) {
    // Find all contacts from the database
    Contact.find({})
        .then(contacts => {
            // Rendering 'home.ejs' view and passing data to the template
            return res.render('home',{ 
                title : 'My Contact List', 
                contact_list : contacts
            });
        })
        .catch(err => {
            console.log('Error in fetching contacts from db:', err);
            return res.status(500).send('Internal Server Error');
        });
});


// Handling GET request for '/practice' route
app.get('/practice', function(req, res){
    // Rendering 'practice.ejs' view
    return res.render('practice', {
        title : 'Lets Play With EJS'
    });
});

// Handling GET request for '/myroute' route
app.get('/myroute', (req, res) => {
    const title = 'My EJS Page';
    const fruits = ['Apple', 'Banana', 'Orange'];
  
    // Rendering 'mytemplate.ejs' view and passing data to the template
    res.render('mytemplate', { title, fruits });
});

// Handling GET requests for '/create-contact' route
app.get('/create-contact', function(req, res) {
    // Rendering the 'home.ejs' view to display the form
    res.render('home', { 
        title: 'Create New Contact', // Setting the title of the page
        contact_list: [] // No need to pass contact list data here since it will be fetched from the database
    });
});

// Handling POST request for '/create-contact' route
app.post('/create-contact', async function(req, res){
    try {
        // Check if name and email are provided
        if (!req.body.name || !req.body.email) {
            throw new Error('Name and email are required.');
        }
        
        // Creating new contact
        const newContact = await Contact.create({
            name: req.body.name,
            email: req.body.email
        });

        console.log('*****', newContact);
        // Redirect back to home page after creating new contact
        res.redirect('/');
    } catch (err) {
        console.error('Error in saving new contact: ', err);
        res.status(500).send('Error in saving new contact: ' + err.message);
    }
});

// Handling 404 errors
app.use(function(req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

// Handling other errors
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Starting the server on specified port
app.listen(port, function(err) {
    if (err) {
        console.log("Error in RUNNING the server.", err);
    } else {
        console.log('Server is running on port:', port);
    }
});
