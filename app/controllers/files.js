'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const File = models.file;

const authenticate = require('./concerns/authenticate');

const middleware = require('app/middleware');
const multer = middleware.multer;

const awsS3Upload = require('lib/aws-s3-upload');

const mime = require('mime-types');
const path = require('path');

const extension = (mimetype, filename) =>
  mime.extension(mimetype) ||
  (!/\/x-/.test(mimetype) && mimetype.replace('/', '/x-')) ||
  path.extname(filename).replace(/^./, '');


const index = (req, res, next) => {
  File.find({ _owner: req.currentUser._id })
    .then(files => res.json({ files }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  File.findById(req.params.id)
    .then(file => file ? res.json({ file }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  let file = {
    mime: req.file.mimetype,
    data: req.file.buffer,
    ext: extension(req.file.mimetype, req.file.originalname),
  };
  awsS3Upload(file)
  .then((s3response) => {
    let file = {
      location: s3response.Location,
      _owner: req.currentUser._id,
      name: req.file.originalname,
      tags: [],
      path: ',Home,'// TODO: make dynamic rather than hard code
  };
    return File.create(file);
  })
  .then((file) => {
    res.status(201).json({ file });
  })
  .catch(err => next(err));

};


const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  File.findOne(search)
    .then(file => {
      if (!file) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return file.update(req.body.file)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  File.findOne(search)
    .then(file => {
      if (!file) {
        return next();
      }

      return file.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};


module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
},
{ before: [
  { method: authenticate  },
  { method: multer.single('file[file]'), only: ['create'] },
]

 });
