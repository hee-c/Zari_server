const socketio = require('socket.io');
const {
  playerJoin,
  playerLeave,
  getRoomPlayers,
  changePlayerCoordinates,
  getRoomPlayersWithoutMe,
  isJoinedPlayer,
  findPlayerById,
} = require('./accessPlayers');

module.exports = server => {
  const io = socketio(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  const videoChatParticipants = {};
  const socketToVideoChatSpace = {};
  const videoChatSpaces = {};

  io.on('connection', socket => {
    socket.on('joinRoom', ({ name, nickname, email, roomId, coordinates, characterType }) => {
      const newPlayer = playerJoin(socket.id, name, nickname, email, roomId, coordinates, characterType);

      socket.join(roomId);

      socket.emit('receiveOnlinePlayers', getRoomPlayersWithoutMe(roomId, email), videoChatSpaces[roomId]);

      socket.to(roomId)
        .emit('newPlayerJoin', newPlayer);
    });

    socket.on('changePlayerCoordinates', coordinates => {
      const changedPlayer = changePlayerCoordinates(socket.id, coordinates);

      socket.to(changedPlayer.roomId)
        .emit('updatePlayerCoordinates', changedPlayer);
    });

    socket.on('leaveRoom', () => {
      const leftPlayer = playerLeave(socket.id);

      if (leftPlayer) {
        socket.to(leftPlayer.roomId)
          .emit('playerLeaveRoom', leftPlayer);

        socket.leave(leftPlayer.roomId);
      }
    });

    socket.on('sendChattingMessage', data => {
      const player = findPlayerById(socket.id);

      io.to(player.roomId)
        .emit('receiveChattingMessage', data);
    });

    socket.on('createVideoChatSpace', (space) => {
      const player = findPlayerById(socket.id);

      if (videoChatSpaces[player.roomId]) {
        videoChatSpaces[player.roomId].push(space);
      } else {
        videoChatSpaces[player.roomId] = [space];
      }

      socket.to(player.roomId)
        .emit('videoChatSpaceCreated', space);
    });

    socket.on('joinVideoChat', roomID => {
      if (videoChatParticipants[roomID]) {
        videoChatParticipants[roomID].push(socket.id);
      } else {
        videoChatParticipants[roomID] = [socket.id];
      }

      socketToVideoChatSpace[socket.id] = roomID;
      const participants = videoChatParticipants[roomID].filter(id => id !== socket.id);

      socket.emit('currentVideoChatParticipants', participants);
    });

    socket.on('sendingSignalToConnectWebRTC', payload => {
      io.to(payload.userToSignal).emit('newVideoChatParticipant', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on('returningSignalToConnectWebRTC', payload => {
      io.to(payload.callerID).emit('receivingReturnedSignalToConnectWebRTC', { signal: payload.signal, id: socket.id });
    });

    socket.on('leaveVideoChat', () => {
      const roomID = socketToVideoChatSpace[socket.id];

      if (videoChatParticipants[roomID]) {
        videoChatParticipants[roomID] = videoChatParticipants[roomID].filter(id => id !== socket.id);
      }

      delete socketToVideoChatSpace[socket.id];

      socket.broadcast.emit('participantLeft', socket.id);
    });

    socket.on('disconnect', () => {
      if (isJoinedPlayer(socket.id)) {
        const roomID = socketToVideoChatSpace[socket.id];

        if (videoChatParticipants[roomID]) {
          videoChatParticipants[roomID] = videoChatParticipants[roomID].filter(id => id !== socket.id);
        }

        delete socketToVideoChatSpace[socket.id];

        socket.broadcast.emit('participantLeft', socket.id);

        const leftPlayer = playerLeave(socket.id);

        socket.to(leftPlayer.roomId)
          .emit('playerLeaveRoom', leftPlayer);

        socket.leave(leftPlayer.roomId);
      }
    });
  });
};
