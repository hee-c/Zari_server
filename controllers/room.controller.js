const createError = require('http-errors');

const Room = require('../models/Room');

exports.getPublicRooms = async function (req, res, next) {
  try {
    const publicRooms = await Room.find({ type: 'public' });

    res.json({
      code: 200,
      message: '',
      data: {
        publicRooms,
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
}
