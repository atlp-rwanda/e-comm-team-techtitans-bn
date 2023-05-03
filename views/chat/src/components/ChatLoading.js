import { Skeleton, Stack } from '@chakra-ui/react';
import React from 'react';

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height="53px" />
      <Skeleton height="53px" />
      <Skeleton height="53px" />
      <Skeleton height="53px" />
      <Skeleton height="53px" />
      <Skeleton height="53px" />
      <Skeleton height="53px" />
      <Skeleton height="53px" />
      <Skeleton height="53px" />
      <Skeleton height="53px" />
    </Stack>
  );
};

export default ChatLoading;
