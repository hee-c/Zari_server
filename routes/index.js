const express = require('express');

const auth = require('./auth');
const user = require('./user');
const room = require('./room');
const router = express.Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/room', room);

module.exports = router;
