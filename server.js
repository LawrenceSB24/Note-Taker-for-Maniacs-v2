// Import for Express package
const express = require('express');
// Import for fs package to write and read files
const fs = require('fs');
// Import for path package to link front-end with back-end
const path = require('path');
// Import for uuid package to generate unique IDS for new and previous notes
const {v4 : uuidv4} = require('uuid');

// Import for clog module
const {clog} = require('./middleware/clog');

// Local host port for Heroku upload
const PORT = process.env.PORT || 3001;

// Initializing app with express
const app = express();

// Statement for app to use custom middleware
app.use(clog);

// Middleware for hadling encrypted and JSON data using express
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Serving static files from the public folder
app.use(express.static('public'));

// GET route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

// GET route for notes page
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET handle to access previous notes
app.get('/api/notes', (req, res) => {
    const prevNote = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf8");
    const parsedNote = JSON.parse(prevNote);
    res.json(parsedNote);
});

// POST handle for posting new notes
app.post('/api/notes', (req, res) => {
    const notes = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf8");
    const parsedNote = JSON.parse(notes);
    const {title, text} = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };
        parsedNote.push(newNote)
        fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(parsedNote), "utf8")
        res.json("Note has been created");
    };

});

// Listener for app connection to the local port
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
});