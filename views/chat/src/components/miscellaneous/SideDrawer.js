import { Button } from '@chakra-ui/button';
import { useDisclosure } from '@chakra-ui/hooks';
import { Input } from '@chakra-ui/input';
import { Box, Text } from '@chakra-ui/layout';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/menu';
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/modal';
import { Tooltip } from '@chakra-ui/tooltip';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Avatar } from '@chakra-ui/avatar';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/toast';
import ChatLoading from '../ChatLoading';
import { Spinner } from '@chakra-ui/spinner';
import ProfileModal from './ProfileModal';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { getSender, theUrl } from '../../config/ChatLogic';
import UserListItem from '../UserAvatar/UserListItem';
import { ChatState } from '../../context/ChatProvider';

function SideDrawer() {
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please Enter something in search',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-left',
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `${theUrl}/api/v1/user/search?fullname=${search}`,
        config,
      );

      setLoading(false);
      setSearchResult(data.data);
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: 'Failed to Load the Search Results',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${theUrl}/api/v1/chats/create/${userId}`,
        config,
      );

      if (!chats.find((c) => c.id === data.data.id))
        setChats([data.data, ...chats]);
      setSelectedChat(data.data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: 'Error fetching the chat',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom-left',
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        // w="100%"
        p="5px 10px 5px 10px"
        border="2px solid"
        borderRadius="10px"
        background="rgba(0,0,0,0.5)"
        // background="rgb(5,3,43)"
        // background="linear-gradient(90deg, rgba(5,3,43,1) 11%, rgba(26,75,139,1) 54%, rgba(77,45,139,1) 83%)"
        // mt="5px"
        mr="100px"
        ml="100px"
        mt="10px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: 'none', md: 'flex' }} px={4} color="#F6F1E9">
              Search For Users
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          // color="#F1F6F9"
          color="#F6F1E9"
          fontWeight="400"
        >
          {'<TechTitans />'}
        </Text>
        <div>
          {/* <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} color="#fff" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && 'No New Messages'}
              {notification.map((notif) => (
                <MenuItem
                key={notif.id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu> */}
          <Menu>
            <MenuButton
              as={Button}
              bg="white"
              rightIcon={<ChevronDownIcon color="#fff" />}
              backgroundColor="rgba(0,0,0,0.5)"
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{' '}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            // background="#394867"
            background="#000"
            // borderBottomWidth="1px"
            color="#F1F6F9"
            borderBottom="1px solid grey"
          >
            Looking For a User?
          </DrawerHeader>
          <DrawerBody background="#000" border="1px solid">
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                color="white"
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user.id}
                  user={user}
                  handleFunction={() => accessChat(user.id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
