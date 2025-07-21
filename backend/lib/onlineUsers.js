const onlineUsers = new Map(); // {userId:socketId}

function addUser(userId, socketId) {
  onlineUsers.set(userId, socketId);
}

function removeUser(socketId) {
  for (let [userId, id] of onlineUsers) {
    if (id === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
}

function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}

export { addUser, removeUser, getOnlineUsers };
