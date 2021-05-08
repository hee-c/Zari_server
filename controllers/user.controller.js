const createError = require('http-errors');

const User = require('../models/User');

exports.getUserData = async function (req, res, next) {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      next(createError(401));
      return;
    }

    res.json({
      code: 200,
      message: 'login success',
      data: {
        user: currentUser,
      },
    });
  } catch (err) {
    next(createError(500, err));
  }
}
