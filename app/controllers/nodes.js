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
// const show = (req, res, next) => {
//   if (req.params.id === "home") {
//     let findPath = new RegExp(`,home,$`);
//     Node.find({
//         path: findPath
//       })
//       .then(nodes => nodes ? res.json({
//         nodes
//       }) : next())
//       .catch(err => next(err));
//   } else {
//     Node.findOne({
//         _id: req.params.id
//       })
//       .then(node => {
//         if (req.params.id === "home") {
//           return new RegExp(`,home,$`);
//         } else {
//           return new RegExp(`,${node.name},$`);
//         }
//       }) //
//       .then(findPath => Node.find({
//         path: findPath
//       }))
//       .then(nodes => nodes ? res.json({
//         nodes
//       }) : next())
//       .catch(err => next(err))
//       .catch(err => next(err));
//   }
// };

// const show = (req, res, next) => {
//   if (req.params.id === "home") {
//     let findPath = new RegExp(`,home,$`);
//     Node.find({
//         path: findPath
//       })
//       .then(nodes => nodes ? res.json({
//         nodes
//       }) : next())
//       .catch(err => next(err));
//   } else {
//     Node.findOne({
//         _id: req.params.id
//       })
//       .then(node => {
//         if (req.params.id === "home") {
//           return new RegExp(`,home,$`);
//         } else {
//           return new RegExp(`,${node.name},$`);
//         }
//       }) //
//       .then(findPath => Node.find({
//         path: findPath
//       }))
//       .then(nodes => nodes ? res.json({
//         nodes
//       }) : next())
//       .catch(err => next(err))
//       .catch(err => next(err));
//   }
//   let findPath = new RegExp(`,${req.params.id},$`);
//   Node.find({
//       path: findPath
//     })
//     .then(nodes => nodes ? res.json({
//       nodes
//     }) : next())
//     .catch(err => next(err));
// };

const show = (req, res, next) => {
  let findPath = new RegExp(`,${req.params.id.toLowerCase()},$`);
  Node.find({
      path: findPath,
      _owner: req.currentUser._id
    })
    .then(nodes => nodes ? res.json({
      nodes
    }) : next())
    .catch(err => next(err));
};

const createFile = (req, res, next) => {
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
        type: "file",
        path: req.body.node.path.toLowerCase()
      };
      return Node.create(file);
    })
    .then((file) => {
      res.status(201).json({
        file
      });
    })
    .catch(err => next(err));
};

const createFolder = (req, res, next) => {
  let node = Object.assign(req.body.node, {
    _owner: req.currentUser._id,
    path: req.body.node.path.toLowerCase(),
    type: "folder"
  });
  Node.create(node)
    .then(node => res.status(201).json({
      node
    }))
    .catch(err => next(err));
};

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
      if (!req.body.node.tags) {
        return next();
      }
      return node.update({
        $push: {
          tags: req.body.node.tags
        }
      });
    })
    .then(() => res.sendStatus(200))
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
