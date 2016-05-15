'use strict';

require('dotenv').config();

// ***Required Node modules:

// require fs to read file
const fs = require('fs');

// require filetype to read from buffer
const fileType = require('file-type');

// require aws functions in separate file
const awsS3Upload = require('../lib/aws-s3-upload');

// require mongoose to use Mongo
const mongoose = require('../app/middleware/mongoose');
const File = require('../app/models/file');

// ***Setting the variables for the promise:


// fileType returns an object with ext & mime, or null
// setting a mock mimeType object to bin/octect for null cases
const mimeType = (data) =>
  Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream',
  }, fileType(data));

// set file to command line argument (or temporarily as '' for testing)
let filename = process.argv[2] || '';
let name = process.argv[3] || 'No name';


const readFile = (filename) =>
  new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });


// ***Upload Function:


// readFile returns a promise. To get the data read, invoke readFile:
readFile(filename)
.then((data) => {
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsS3Upload)
.then((s3response) => {
  let file = {
    location: s3response.Location,
    name: name,
    tags: [],
    _owner: "5738b540b8363dbb8a2b397b"
  };
    return File.create(file);
})
.then(console.log)
.catch(console.error)
.then(() => mongoose.connection.close);
