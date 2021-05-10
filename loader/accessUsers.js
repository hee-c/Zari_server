const users = [];

function userJoin(socketId, name, email, roomId, coordinates) {
  const user = {
    socketId,
    name,
    email,
    roomId,
    coordinates,
  };
  users.push(user);

  return user;
}

function changeCoordinates(socketId, coordinates) {
  const user = users.find(user => user.socketId === socketId);
  user.coordinates = coordinates;

  return user;
}

function userLeave(socketId) {
  const index = users.findIndex(user => user.socketId === socketId);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

function getRoomUsers(roomId) {
  return users.filter(user => user.roomId === roomId);
}

module.exports = {
  userJoin,
  userLeave,
  getRoomUsers,
  changeCoordinates,
};
