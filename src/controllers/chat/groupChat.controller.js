import models from '../../database/models';

const Message = models.allmessages;

const GroupChatReceive = (req, res) => {
  Message.findAll().then((message) => {
    res.status(200).json({
      message: 'receiveing message.........',
      data: message,
    });
  }).then((error) => {
    console.log(error);
  });
};

const GroupChatSend = (req, res) => {
  const { text, name, time } = req.body;
  Message.create({
    text,
    name,
    time,
  })
    .then((message) => {
      console.log('Group message created:', message.toJSON());
    })
    .catch((error) => {
      console.error('Error creating group message:', error);
    });
  res.status(200).json({
    message: 'sending message.........',
    data: { text, name, time },
  });
};

export { GroupChatReceive, GroupChatSend };
