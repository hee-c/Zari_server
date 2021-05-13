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

  const users = {};
  const socketToRoom = {};

  io.on('connection', socket => {
    let targetRoomId;
    console.log(socket.id + ' connected')

    socket.on('joinRoom', ({ name, email, roomId, coordinates, character }) => {
      targetRoomId = roomId;

      userJoin(socket.id, name, email, roomId, coordinates, character);

      socket.join(roomId);

      io.to(roomId)
        .emit('updateUsers', getRoomUsers(roomId));
    });

    socket.on('changeCoordinates', coordinates => {
      changeCoordinates(socket.id, coordinates);

      io.to(targetRoomId)
        .emit('updateUsers', getRoomUsers(targetRoomId));
    });

    socket.on('join videoChat', roomID => {
      console.log('join videoChat')
      if (users[roomID]) {
        const length = users[roomID].length;
        if (length === 4) {
          socket.emit('room full');
          return;
        }
        users[roomID].push(socket.id);
      } else {
        users[roomID] = [socket.id];
      }
      socketToRoom[socket.id] = roomID;
      const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

      console.log(users)
      console.log(socketToRoom)

      socket.emit('all users', usersInThisRoom);
    });

    socket.on('sending signal', payload => {
      console.log('sending signal')
      io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('returning signal', payload => {
      console.log('returning signal')
      io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
      const roomID = socketToRoom[socket.id];

      if (users[roomID]) {
        users[roomID] = users[roomID].filter(id => id !== socket.id);
      }

      delete socketToRoom[socket.id];

      const leftUser = userLeave(socket.id);
      console.log(socket.id + ' disconnected')

      io.to(targetRoomId)
        .emit('updateUsers', getRoomUsers(targetRoomId));
      io.to(targetRoomId)
        .emit('userLeave', leftUser);

      socket.leave(targetRoomId);
    });
  });
};
