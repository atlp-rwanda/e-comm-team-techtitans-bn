import { Box } from '@chakra-ui/layout';
// import './styles.css';
import SingleChat from './SingleChat';
import { ChatState } from '../context/ChatProvider';

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: '100%', md: '68%' }}
      borderRadius="lg"
      border="2px solid"
      // borderWidth="1px"
      backgroundColor="rgba(0,0,0,0.4)"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
