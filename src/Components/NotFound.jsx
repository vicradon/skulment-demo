import { Flex, Heading } from "@chakra-ui/core";
import React from "react";

const NotFound = () => {
  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Heading size="lg" fontWeight="500">
        404{" "}
      </Heading>
      <Heading size="lg" fontWeight="300" ml=".5rem">
        | Not Found
      </Heading>
    </Flex>
  );
};

export default NotFound;
