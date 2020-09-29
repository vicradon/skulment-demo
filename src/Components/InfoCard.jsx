import { Box, Flex, Heading } from "@chakra-ui/core";
import React from "react";

const InfoCard = ({ title, value, children }) => {
  return (
    <Flex
      p="1rem"
      shadow="md"
      border="5px"
      align="center"
      rounded
      borderColor="gray.200"
    >
      {children}
      <Box ml="4rem">
        <Heading size="md" fontWeight="400">
          {title}
        </Heading>
        <Heading textAlign="right" size="2xl" color="gray.600" fontWeight="600">
          {value}
        </Heading>
      </Box>
    </Flex>
  );
};

export default InfoCard;
