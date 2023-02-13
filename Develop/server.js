const express = require('express');
const path = require('path');
const fs = require('fs');

const uuid = require('./helpers/uuid');


const jsonData = require('./db/db.json');

const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

app.get('/', (req, res) => {
    
    res.sendFile(path.json(__dirname, '/public/index.html')
    )});

app.get('/notes', (req, res) => {
    
    res.sendFile(__dirname + '/public/notes.html');
    
  });

// GET request for notes
app.get('/api/notes', (req, res) => {
    res.status(200).json(jsonData);
  });

  app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a review`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        id: uuid(),
        title,
        text,
      };

      // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedReviews = JSON.parse(data);
  
          // Add a new note
          parsedReviews.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedReviews, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated the notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });

app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT}`));