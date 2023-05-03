import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { theUrl } from '../../config/ChatLogic';

const Signup = () => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => {
    setShow(!show);
  };
  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'chat-app');
      data.append('cloud_name', 'dlw8ohn6p');
      fetch('https://api.cloudinary.com/v1_1/dlw8ohn6p/image/upload', {
        method: 'post',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    } else {
      toast({
        title: 'Please select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: 'Please Fill all the Feilds',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: 'Passwords Do Not Match',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        `${theUrl}/api/v1/user/signup`,
        // { name, email, password, pic },
        { fullname: name, email, password, confirmpassword },
        config,
      );
      toast({
        title: 'Registration Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });

      localStorage.setItem('userInfo', JSON.stringify(data));

      setLoading(false);
      // history.push(`${theUrl}/api/v1/chats`);
      history.push(`${theUrl}/api/v1/chats`);
      // eslint-disable-next-line no-restricted-globals
      location.reload();
    } catch (error) {
      toast({
        title: 'Error Occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
    }
  };

  return (
    <>
      <div style={{ color: '#000', textAlign: 'center' }}>
        🚫 Signing up is not accessible at the moment, <br />
        please login as a Guest instead...
      </div>
    </>
    // <VStack spacing="5px" color="black">
    //   <FormControl id="first-name" isRequired>
    //     <FormLabel>Name</FormLabel>
    //     <Input
    //       placeholder="Enter your Name"
    //       onChange={(e) => setName(e.target.value)}
    //     />
    //   </FormControl>

    //   <FormControl id="email" isRequired>
    //     <FormLabel>Email</FormLabel>
    //     <Input
    //       placeholder="Enter your Email"
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //   </FormControl>

    //   <FormControl id="password" isRequired>
    //     <FormLabel>Password</FormLabel>
    //     <InputGroup>
    //       <Input
    //         type={show ? 'text' : 'password'}
    //         placeholder="Password"
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //       <InputRightElement width="4.5rem">
    //         <Button h="1.7rem" size="sm" onClick={handleClick}>
    //           {show ? 'Hide' : 'Show'}
    //         </Button>
    //       </InputRightElement>
    //     </InputGroup>
    //   </FormControl>

    //   <FormControl id="password" isRequired>
    //     <FormLabel>Confirm Password</FormLabel>
    //     <InputGroup size="md">
    //       <Input
    //         type={show ? 'text' : 'password'}
    //         placeholder="Confirm Password"
    //         onChange={(e) => setConfirmpassword(e.target.value)}
    //       />
    //       <InputRightElement width="4.5rem">
    //         <Button h="1.7rem" size="sm" onClick={handleClick}>
    //           {show ? 'Hide' : 'Show'}
    //         </Button>
    //       </InputRightElement>
    //     </InputGroup>
    //   </FormControl>

    //   {/* <FormControl id="pic">
    //     <FormLabel>Upload your Picture</FormLabel>
    //     <Input
    //       type="file"
    //       p={1.5}
    //       accept="image/*"
    //       onChange={(e) => postDetails(e.target.files[0])}
    //     />
    //   </FormControl> */}
    //   <Button
    //     colorScheme="blue"
    //     width="100%"
    //     style={{ marginTop: 15 }}
    //     onClick={submitHandler}
    //     isLoading={loading}
    //   >
    //     Sign Up
    //   </Button>
    // </VStack>
  );
};

export default Signup;
