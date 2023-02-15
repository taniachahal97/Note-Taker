const express = require('express');
const path = require('path');
const fs = require('fs');

const uuid = require('./helpers/uuid');


//const jsonData = require('./db/db.json');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));


// GET request for notes
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db/db.json'));
});



app.post('/api/notes', (req, res) => {
  let notes = [];
  
  fs.readFile('./db/db.json','utf8',(err, data) => {
    if (err) throw err;
    notes = JSON.parse(data);

    const { title, text } = req.body;
  
    // If all the required properties are present
  
      // Variable for the object we will save
    const newNote = {
        id: uuid(),
        title,
        text,
    };

  // pushing created note to be written in the db.json file
    notes.push(newNote);

    fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
      if (err) throw err;
        res.send(notes);
      });

  });

  

});
  
  app.delete('/api/notes/:id', (req, res) => {

    // read data from the file 

    let notes = [];
    const noteId = req.params.id

    fs.readFile('./db/db.json','utf8',(err, data) => {
        if (err) throw err;
        notes = JSON.parse(data);

        const noteIndex = notes.findIndex(note => note.id === noteId);
  
        if (noteIndex === -1) {
          return res.status(404).send('Review not found');
        }

        notes.splice(noteIndex, 1);

        fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
          if (err) throw err;
            res.send(notes);
          });

      });

      

  });

app.get('/notes', (req, res) => {
    
  res.sendFile(__dirname + '/public/notes.html');
  
});

app.get('/', (req, res) => {
    
    res.sendFile(path.json(__dirname, '/public/index.html')
    )});

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`));