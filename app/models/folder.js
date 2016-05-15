'use strict';

const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: String,
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tags: {
    type: Array
  },
  path: {
    type: String
  },
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Folder = mongoose.model('Folder', folderSchema);

module.exports = Folder;
