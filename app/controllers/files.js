'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const File = models.file;

const authenticate = require('./concerns/authenticate');



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
  destroy,
},
{ before: [
  { method: authenticate },
]

 });
