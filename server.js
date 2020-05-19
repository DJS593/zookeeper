const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();
const { animals } = require('./data/animals');


// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());

// building routes for front-end files to be used by designating the file 'public' that the files reside in
app.use(express.static('public'));




function filterByQuery(query, animalsArray) {
  let personalityTraitsArray = [];
  // Note we save the animalsArray as filteredResults here:
  let filteredResults = animalsArray;
  if (query.personalityTraits) {
    // Save pesonalityTraits as a dedicated array.
    // If personalityTraits is a string, place it into a new array and save:
    if (typeof query.personalityTraits === 'string') {
      personalityTraitsArray = [query.personalityTraits];
    } else {
      personalityTraitsArray = query.personalityTraits;
    }
  }
  // Loop through each trait in the personalityTraits array
  personalityTraitsArray.forEach(trait => {
    // Check the trait against each animal in teh filteredResults array.
    // Remember, it is initially a copy of the animalsArray,
    // but here we're updating it for each trait in the .forEach() loop.
    // For each trait being targeted by the filter, the filteredResults
    // array will then contain only the entries that contain the trait,
    // so at the end we'll have an array of animals that have every one 
    // of the traits when the .forEach() loop is finished.
    filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
  });
  
  if (query.diet) {
    filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
  }
  if (query.species) {
    filteredResults = filteredResults.filter(animal => animal.species === query.species);
  }
  if (query.name) {
    filteredResults = filteredResults.filter(animal => animal.name === query.name);
  }
  // return the filtered results:
  return filteredResults;
}


function findById(id, animalsArray) {
  const result = animalsArray.filter(animal => animal.id === id)[0];
  return result;
}


function createNewAnimal(body, animalsArray) {
  const animal = body;
  animalsArray.push(animal);
  fs.writeFileSync(
    path.join(__dirname, './data/animals.json'),
    JSON.stringify({ animals: animalsArray }, null, 2)
  );

  return animal;
}


function validateAnimal(animal) {
  if (!animal.name || typeof animal.name !== 'string') {
    return false;
  }
  if (!animal.species || typeof animal.species !== 'string') {
    return false;
  }
  if (!animal.diet || typeof animal.diet !== 'string') {
    return false;
  }
  if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
    return false;
  }
  return true;
}



//the app() method requires two arguments; 1. a string 2. callback function taht will execture every time that route is accessed with a GET request

app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});


app.get('/api/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
    // changed from send to sendStatus due to prompt on the command line; res.send is deprecated and they suggest res.sendStatus(status)
  }
});

// create a route that listens for POST requests
app.post('/api/animals', (req, res) => {
  // set id based on what the next index of the array will be
  req.body.id = animals.length.toString();

  // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.')
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});




// sets route for index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});


// sets route for animals.html; note: not use api in the name because we are pulling html data not JSON (industry standard, not required)
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});


// set route for zookeepers.html
app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});


// adding listen() to the bottom of file (should be at bottom of page)
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});