const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
//const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();
//const { animals } = require('./data/animals');


// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// building routes for front-end files to be used by designating the file 'public' that the files reside in
app.use(express.static('public'));


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