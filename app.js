require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const http = require('http');
const statuses = require('statuses');
const logger = require("morgan");

const { authHeader } = require('./constants');
const webSocket = require('./loader/socketio');
require('./loader/database');
require('./loader/firebaseAdmin');

const port = process.env.PORT || '5000';
const app = express();
const server = http.createServer(app);

webSocket(server);

app.use(logger("dev"));
app.use(cors({ exposedHeaders: authHeader }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(require('./routes'));

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.status || 500);
  res.json({
    code: res.status,
    message: statuses[res.status],
  });
});

server.listen(port);
