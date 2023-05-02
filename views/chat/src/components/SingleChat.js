import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { theUrl } from '../config/ChatLogic';
import { ChatState } from '../context/ChatProvider';
// import ProfileModal from './miscellaneous/ProfileModal';
// import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import './styles.css';
import io from 'socket.io-client';
import animationData from '../animations/typing.json';
import Lottie from 'react-lottie';

const socket = io.connect(`http://localhost:1001`);

let selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const fetchMessages = async (req, res) => {
    if (!selectedChat) return; //don't do anything, just return if no chat is selected.

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${theUrl}/api/v1/chats/one/${selectedChat.id}`,
        config,
      );

      setMessages(data.data.messages);
      setLoading(false);

      // socket.emit('join chat', selectedChat.id);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Messages',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  useEffect(() => {
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat.id);
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage('');
        const { data } = await axios.post(
          `${theUrl}/api/v1/message/send/${selectedChat.id}`,
          {
            // chatId: selectedChat.id,
            content: newMessage,
          },
          config,
        );

        // socket.emit('send_message', data);
        socket.emit('send_message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Error Occured!',
          description: 'Failed to send the Message',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'bottom',
        });
      }
    }
  };

  //..................................................... Realtime messages 👇🏽 .......................................................

  useEffect(() => {
    socket.on('receive_message', (data) => {
      if (
        !selectedChatCompare || // if the chat is not selected or doesn't match current chat
        selectedChatCompare.id !== data.chatId
      ) {
      } else {
        socket.emit('send_message', data.content);
        setMessages([...messages, data]);
      }
    });
  });
  //.....................................................Realtime messages 👆🏽 ......................................................

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat.id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat.id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: '28px', md: '30px' }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: 'space-between' }}
            alignItems="center"
            color="#fff"
          >
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowBackIcon color="#000" fontWeight="700" />}
              onClick={() => setSelectedChat('')}
              // backgroundColor="#000"
            />
            <>
              {selectedChat.chatName.toUpperCase()}

              {/* <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              /> */}
            </>
            {/* {!selectedChat.senderId ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )} */}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
                color="#fff"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
            >
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  />
                </div>
              ) : (
                <></>
              )}
              <Input
                variant="filled"
                bg="rgba(0,0,0,0.4)"
                border="1px solid black"
                placeholder="Enter a message..."
                onChange={typingHandler}
                value={newMessage}
                color="#fff"
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
          color="#FFFFFF"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting...
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
