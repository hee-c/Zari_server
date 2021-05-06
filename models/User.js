const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  picture: {
    type: String,
    trim: true,
  },
  character: {
    type: Object,
  },
  privatePlaces: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
  }]
});

module.exports = mongoose.model('User', userSchema);
