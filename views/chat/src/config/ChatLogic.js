export const isSameSenderMargin = (messages, m, i, userId) => {
  // m is current message

  if (
    i < messages.length - 1 &&
    messages[i + 1].senderId === m.senderId &&
    messages[i].senderId !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].senderId !== m.senderId &&
      messages[i].senderId !== userId) ||
    (i === messages.length - 1 && messages[i].senderId !== userId)
  )
    return 0;
  else return 'auto';
};

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].senderId !== m.senderId ||
      messages[i + 1].senderId === undefined) &&
    messages[i].senderId !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].senderId !== userId &&
    messages[messages.length - 1].senderId
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].senderId === m.senderId;
};

export const getSender = (loggedUser, users) => {
  return users[0].id === loggedUser.id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return users[0].id === loggedUser.id ? users[1] : users[0];
};

export const theUrl = 'http://localhost:1001';
