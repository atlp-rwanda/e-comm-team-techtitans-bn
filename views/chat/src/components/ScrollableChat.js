import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
import jwt_decode from 'jwt-decode';
import { v4 as uuidv4 } from 'uuid';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const token = config.headers.Authorization.split(' ')[1];
  let decodedToken = jwt_decode(token);
  const { id } = decodedToken;

  // const randomNumber = Date.now() * Math.floor(Math.random() * Math.random());
  // const randomUUID = uuidv4();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: 'flex' }} key={m.id}>
            {(isSameSender(messages, m, i, user.id) ||
              isLastMessage(messages, i, user.id)) && (
              <span
                style={{
                  display: isSameSenderMargin(messages, m, i, id)
                    ? 'none'
                    : 'flex',
                }}
              >
                <Tooltip
                  label="Received Message"
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor="pointer"
                    src="https://png.pngtree.com/png-vector/20220621/ourmid/pngtree-user-avatar-icon-profile-silhouette-png-image_5252378.png"
                  />
                </Tooltip>
              </span>
            )}
            <span
              style={{
                backgroundColor: `${
                  // m.senderId === user.id ? '#BEE3F8' : '#B9F5D0'
                  // m.senderId !== id ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.2)'
                  m.senderId !== id ? 'rgb(5,3,43)' : '#37306B'
                }`,
                marginLeft: isSameSenderMargin(messages, m, i, id),
                marginTop: isSameUser(messages, m, i, id) ? 3 : 10,
                borderRadius: '20px',
                padding: '5px 15px',
                maxWidth: '75%',
                color: 'white',
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
