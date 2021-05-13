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
    type: String,
    trim: true,
  },
  privateRooms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
  }]
});

module.exports = mongoose.model('User', userSchema);
