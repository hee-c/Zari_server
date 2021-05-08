const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const User = require('../models/User');
const { accessTokenExpired } = require('../constants');

exports.login = async function (req, res, next) {
  try {
    console.log(req.body)
    const { email, name, picture } = await admin.auth().verifyIdToken(req.body.id_token);
    const currentUser = await User.findOne({ email });

    if (currentUser) {
      res.json({
        code: 200,
        message: 'login success',
        data: {
          accessToken: jwt.sign(
            { id: currentUser._id },
            process.env.JWT_SECRET,
            { expiresIn: accessTokenExpired }
          ),
          email,
          name,
          picture,
        },
      });
    } else {
      const newUser = await User.create({
        email,
        name,
        picture
      });

      res.json({
        code: 200,
        message: 'login success',
        data: {
          accessToken: jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: accessTokenExpired }
          ),
          email,
          name,
          picture,
        },
      });
    }
  } catch (err) {
    next(createError(500, err));
  }
};
