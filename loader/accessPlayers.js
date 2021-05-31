const players = [];

function playerJoin(socketId, name, nickname, email, roomId, coordinates, characterType) {
  const player = {
    socketId,
    name,
    nickname,
    email,
    roomId,
    coordinates,
    characterType,
  };

  players.push(player);

  return player;
}

function changePlayerCoordinates(socketId, coordinates) {
  const player = players.find(player => player.socketId === socketId);
  player.coordinates = coordinates;

  return player;
}

function playerLeave(socketId) {
  const index = players.findIndex(player => player.socketId === socketId);

  if (index !== -1) {
    return players.splice(index, 1)[0];
  }
}

function getRoomPlayers(roomId) {
  return players.filter(player => player.roomId === roomId);
}

function getRoomPlayersWithoutMe(roomId, email) {
  return players.filter(player => player.roomId === roomId && player.email !== email);
}

function isJoinedPlayer(socketId) {
  const index = players.findIndex(player => player.socketId === socketId);

  if (index !== -1) {
    return true;
  }

  return false;
}

function findPlayerById(socketId) {
  return players.find(player => player.socketId === socketId);
}

module.exports = {
  playerJoin,
  playerLeave,
  getRoomPlayers,
  changePlayerCoordinates,
  getRoomPlayersWithoutMe,
  isJoinedPlayer,
  findPlayerById,
};
