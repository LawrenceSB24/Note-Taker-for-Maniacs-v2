const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid');

const {clog} = require('./middleware/clog');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(clog);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

// GET route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

// GET route for notes page
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"))
});

// GET to access previous notes
app.get('/api/notes', (req, res) => {
    const prevNote = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf8");
    const parsedNote = JSON.parse(prevNote);
    res.json(parsedNote);
});

// POST to handle posting new notes
app.post('/api/notes', (req, res) => {
    const newNote = fs.readFileSync(path.join(__dirname, './db/db.json'), "utf8");
    const parsedNote = JSON.parse(newNote);
    req.body.id = uuidv4();
    parsedNote.push(req.body);

    fs.writeFileSync(path.join(__dirname, "./db/db.json"), JSON.stringify(parsedNote), "utf8");
    res.json("Note has been created");
})

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
});