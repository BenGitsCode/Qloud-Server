'use strict';

const mongoose = require('mongoose');

const exampleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },

  toJSON: { virtuals: true },
});

exampleSchema.virtual('length').get(function length() {
  return this.text.length;
});

const Example = mongoose.model('Example', exampleSchema);

module.exports = Example;
