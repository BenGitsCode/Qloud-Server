'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Folder = models.folder;

const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Folder.find()
    .then(folders => res.json({ folders }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Folder.findById(req.params.id)
    .then(folder => folder ? res.json({ folder }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  let folder = Object.assign(req.body.folder, {
    _owner: req.currentUser._id,
  });
  Folder.create(folder)
    .then(folder => res.json({ folder }))
    .catch(err => next(err));
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Folder.findOne(search)
    .then(folder => {
      if (!folder) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return folder.update(req.body.folder)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Folder.findOne(search)
    .then(folder => {
      if (!folder) {
        return next();
      }

      return folder.remove()
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
  { method: authenticate },
]

 });
