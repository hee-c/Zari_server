const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  type: {
    type: String,
    trim: true,
    enum: ['public', 'private'],
  },
  map: {
    type: String,
    trim: true,
    enum: ['hanRiver', 'karaoke'],
    required: true,
  },
});

module.exports = mongoose.model('Room', roomSchema);
