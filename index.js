// Importing required modules
const express = require('express'); // Importing Express.js
const path = require('path'); // Importing Path module
const port = 8000; // Declaring the server port

// Initializing Express app
const app = express();

// Setting view engine to use EJS
app.set('view engine', 'ejs');

// Setting views directory
app.set('views', path.join(__dirname, 'views'));

// Using middleware to parse form data and serve static assets
app.use(express.urlencoded()); // Middleware to parse form data
app.use(express.static('assets')); // Serving static assets from the 'assets' directory

// Middleware to log request received time
app.use(function(req, res, next){
    console.log(`Request received at ${new Date()}`);
    next();
});

// Creating a contact list array
var contactList = [
    { name: "John Doe", email:"john@doe.com" },
    { name: "Jane Smith", email:"jane@smith.com" },
    { name: "Shiva", email:"shivar@shiv.com"}
];

// Handling GET request for the root URL '/'
app.get('/', function(req, res) {
    // Rendering 'home.ejs' view and passing data to the template
    return res.render('home',{ 
        title : 'My Contact List', 
        contact_list : contactList
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

// For deleting a contact 
app.get('/delete-contact', function(req, res){
    
    let email = req.query.email;//get the query from the url

    let contactIndex = contactList.findIndex(contact => contact.email == email);

    if (contactIndex != -1){
        contactList.splice(contactIndex, 1);
    }

    return res.redirect('back');

});

// Handling POST request for '/create-contact' route
app.post('/create-contact', function(req, res){
    // Adding new contact to contactList array from form data
    contactList.push({
        name : req.body.name,
        email : req.body.email
    });

    // Redirecting back to the root URL '/'
    return res.redirect('/');
});

// Starting the server on specified port
app.listen(port, function(err) {
    if (err) {
        console.log("Error in RUNNING the server.", err);
    } else {
        console.log('Server is running on port:', port);
    }
});
