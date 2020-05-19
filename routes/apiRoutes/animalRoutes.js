const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
const router = require('express').Router();


// change app to route since app can only be used in the file that express is "tied" to
router.get('/animals', (req, res) => {
  let results = animals;
  if (req.query) {
    results = filterByQuery(req.query, results);
  }
  res.json(results);
});


router.get('/animals/:id', (req, res) => {
  const result = findById(req.params.id, animals);
  if (result) {
    res.json(result);
  } else {
    res.sendStatus(404);
    // changed from send to sendStatus due to prompt on the command line; res.send is deprecated and they suggest res.sendStatus(status)
  }
});

// create a route that listens for POST requests
router.post('/animals', (req, res) => {
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


module.exports = router;