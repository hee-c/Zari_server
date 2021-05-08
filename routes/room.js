const express = require('express');

const roomController = require('../controllers/room.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/', verifyToken, roomController.getPublicRooms);

module.exports = router;
