const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Place', placeSchema);
