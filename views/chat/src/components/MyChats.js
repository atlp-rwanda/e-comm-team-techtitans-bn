import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogic';
import GroupChatModal from './miscellaneous/GroupChatModal';
import { theUrl } from '../config/ChatLogic';
import jwt_decode from 'jwt-decode';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const token = config.headers.Authorization.split(' ')[1];
      let decodedToken = jwt_decode(token);

      const { data } = await axios.get(`${theUrl}/api/v1/chats/all`, config);
      setChats(data.data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: '😬 Failed to Load the chats...',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: '100%', md: '31%' }}
      borderRadius="lg"
      border="2px solid"
      // borderWidth="1px"
      // backgroundColor="#394867"
      backgroundColor="rgba(0,0,0,0.2)"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '28px', md: '30px' }}
        fontFamily="Work sans"
        // display="flex"
        // w="100%"
        fontWeight="900"
        justifyContent="space-between"
        alignItems="center"
        color="#F1F6F9"
      >
        My Chats
        <GroupChatModal>
          {/* <Button
            d="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            float="right"
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button> */}
        </GroupChatModal>
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        background="rgba(0,0,0,0.7)"
        color="#EEE"
        backgroundColor="rgba(0,0,0,0.2)"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? '#F1F6F9' : 'rgba(0,0,0,0.2)'}
                color={selectedChat === chat ? 'black' : 'white'}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat.id}
                // backgroundColor="#9BA4B5"
                // background="rgba(0,0,0,0.2)"
                border="1px"
              >
                <Text>{chat.chatName}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
