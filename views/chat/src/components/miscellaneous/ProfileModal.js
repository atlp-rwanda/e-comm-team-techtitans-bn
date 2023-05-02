import {
  Button,
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ViewIcon } from '@chakra-ui/icons';
import React from 'react';
import jwt_decode from 'jwt-decode';

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const token = config.headers.Authorization.split(' ')[1];
  let decodedToken = jwt_decode(token);
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: 'flex' }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent background="#DDDDDD" borderRadius="60px 0 60px 0">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work Sans"
            display="flex"
            justifyContent="center"
          >
            {decodedToken.fullname}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              // src={user.pic}
              src="https://static.thenounproject.com/png/630737-200.png"
              alt="Profile Picture"
            />
            <Text
              fontSize={{ base: '28px', md: '30px' }}
              fontFamily="Work Sans"
            >
              Email: {decodedToken.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
