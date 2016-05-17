'use strict';

const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  name: String,
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // node tags
  tags: {
    type: Array
  },
  type : {
    type: String
  },
  // materialized path for virtual node system
  path: {
    type: String
  },
  // URL for node on amazon s3
  location: {
    type: String
  },
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;
