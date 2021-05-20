const socketio = require('socket.io');
const {
  userJoin,
  userLeave,
  getRoomUsers,
  changeCoordinates,
  getRoomUsersWithoutMe,
  isJoinedUser,
} = require('./accessUsers');

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const users = {};
  const socketToRoom = {};
  const videoChatSpaces = {};

  io.on('connection', socket => {
    socket.on('joinRoom', ({ name, email, roomId, coordinates, characterType }) => {
      const newUser = userJoin(socket.id, name, email, roomId, coordinates, characterType);

      socket.join(roomId);

      socket.emit('receiveOnlineUsers', getRoomUsersWithoutMe(roomId, email));

      socket.to(roomId)
        .emit('newUserJoin', newUser);
    });

    socket.on('changeCoordinates', coordinates => {
      const changedUser = changeCoordinates(socket.id, coordinates);

      socket.to(changedUser.roomId)
        .emit('updateUserCoordinates', changedUser);
    });

    socket.on('userLeaveRoom', () => {
      const leftUser = userLeave(socket.id);

      socket.to(leftUser.roomId)
        .emit('userLeave', leftUser);

      socket.leave(leftUser.roomId);
    });

    socket.on('join videoChat', roomID => {
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

      socket.emit('all users', usersInThisRoom);
    });

    socket.on('sending signal', payload => {
      io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('returning signal', payload => {
      io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('leave videoChat', () => {
      const roomID = socketToRoom[socket.id];

      if (users[roomID]) {
        users[roomID] = users[roomID].filter(id => id !== socket.id);
      }

      delete socketToRoom[socket.id];

      socket.broadcast.emit('user left', socket.id);
    });

    socket.on('disconnect', () => {
      if (isJoinedUser(socket.id)) {
        const roomID = socketToRoom[socket.id];

        if (users[roomID]) {
          users[roomID] = users[roomID].filter(id => id !== socket.id);
        }

        delete socketToRoom[socket.id];

        socket.broadcast.emit('user left', socket.id);

        const leftUser = userLeave(socket.id);

        socket.to(leftUser.roomId)
          .emit('userLeave', leftUser);

        socket.leave(leftUser.roomId);
      }
    });
  });
};
