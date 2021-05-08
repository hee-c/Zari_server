const express = require('express');

const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middlewares/verifyToken');
const router = express.Router();

router.get('/', verifyToken, userController.getUserData);

module.exports = router;
