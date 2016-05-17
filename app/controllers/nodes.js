'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Node = models.node;

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
  Node.find({
      _owner: req.currentUser._id
    })
    .then(nodes => res.json({
      nodes
    }))
    .catch(err => next(err));
};

// we'll need to change this to use ids
const show = (req, res, next) => {
  if (req.params.id === "home") {
    let findPath = new RegExp(`,home,$`);
    Node.find({
        path: findPath
      })
      .then(nodes => nodes ? res.json({
        nodes
      }) : next())
      .catch(err => next(err));
  } else {
    Node.findOne({
        _id: req.params.id
      })
      .then(node => {
        if (req.params.id === "home") {
          return new RegExp(`,home,$`);
        } else {
          return new RegExp(`,${node.name},$`);
        }
      }) //
      .then(findPath => Node.find({
        path: findPath
      }))
      .then(nodes => nodes ? res.json({
        nodes
      }) : next())
      .catch(err => next(err))
      .catch(err => next(err));
  }
};

const createFile = (req, res, next) => {
//   let node = {
//     mime: req.node.mimetype,
//     data: req.node.buffer,
//     ext: extension(req.node.mimetype, req.node.originalname),
//   };
//   awsS3Upload(node)
//   .then((s3response) => {
//     let node = {
//       location: s3response.Location,
//       _owner: req.currentUser._id,
//       name: req.node.originalname,
//       tags: [],
//       type: "file",
//       path: req.body.node.path // specify path to file in request body
//   };
//     return Node.create(node);
//   })
//   .then((node) => {
//     res.status(201).json({ node });
//   })
//   .catch(err => next(err));
//
  let node = {
    mime: req.node.mimetype,
    data: req.node.buffer,
    ext: extension(req.node.mimetype, req.node.originalname),
  };
  awsS3Upload(node)
    .then((s3response) => {
      let node = {
        location: s3response.Location,
        _owner: req.currentUser._id,
        name: req.node.originalname,
        tags: [],
        type: "file",
        path: req.body.node.path // specify path to file in request body
      };
      return Node.create(node);
    })
    .then((node) => {
      res.status(201).json({
        node
      });
    })
    .catch(err => next(err));

};

const createFolder = (req, res, next) => {
  let node = Object.assign(req.body.node, {
    _owner: req.currentUser._id,
    path: req.body.node.path,
    type: "folder"
  });
  Node.create(node)
    .then(node => res.json({
      node
    }))
    .catch(err => next(err));
};

// const update = (req, res, next) => {
//   let search = { _id: req.params.id, _owner: req.currentUser._id };
//   Node.findOne(search)
//     .then(node => {
//       if (!node) {
//         return next();
//       }
//       delete req.body._id; // remove id so it is not altered
//       delete req.body._owner;  // disallow owner reassignment.
//       return node.update(req.body);
//       // return node.update(req.body.node);
//     })
//     .then(() => res.sendStatus(200))
//     .catch(err => next(err));
// };

const update = (req, res, next) => {
  let search = {
    _id: req.params.id,
    _owner: req.currentUser._id
  };
  Node.findOne(search)
    .then(node => {
      if (!node) {
        return next();
      }

      delete req.body._owner; // disallow owner reassignment.
      return node.update(req.body.node)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = {
    _id: req.params.id,
    _owner: req.currentUser._id
  };
  Node.findOne(search)
    .then(node => {
      if (!node) {
        return next();
      }

      return node.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};


module.exports = controller({
  index,
  show,
  update,
  destroy,
  createFolder,
  createFile
}, {
  before: [{
    method: authenticate
  }, {
    method: multer.single('node[node]'),
    only: ['create']
  }, ]

});
