const socketio = require('socket.io');
const {
  userJoin,
  userLeave,
  getRoomUsers,
  changeCoordinates,
} = require('./accessUsers');

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', socket => {
    let targetRoomId;
    console.log(socket.id + ' connected')

    socket.on('joinRoom', ({ name, email, roomId, coordinates }) => {
      targetRoomId = roomId;

      userJoin(socket.id, name, email, targetRoomId, coordinates);

      socket.join(targetRoomId);

      io.to(targetRoomId)
        .emit('updateUsers', getRoomUsers(targetRoomId));
    });

    socket.on('changeCoordinates', coordinates => {
      changeCoordinates(socket.id, coordinates);

      io.to(targetRoomId)
        .emit('updateUsers', getRoomUsers(targetRoomId));
    });

    socket.on('disconnect', () => {
      userLeave(socket.id);
      console.log(socket.id + ' disconnected')

      io.to(targetRoomId)
        .emit('updateUsers', getRoomUsers(targetRoomId));

      socket.leave(targetRoomId);
    });
  });
};
