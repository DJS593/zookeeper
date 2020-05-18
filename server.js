const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();

const { animals } = require('./data/animals');













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



//the app() method requires two arguments; 1. a string 2. callback function taht will execture every time that route is accessed with a GET request

app.get('/api/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});


// adding listen() to the bottom of file
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});