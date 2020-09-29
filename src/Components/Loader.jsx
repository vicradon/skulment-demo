import { Flex } from "@chakra-ui/core";
import React from "react";
import LoaderComponent from "react-loader-spinner";

const Loader = ({ global }) => {
  return (
    <Flex
      w="100%"
      h={`${global ? "100vh" : "100%"}`}
      justify="center"
      align="center"
    >
      <LoaderComponent
        type="BallTriangle"
        color="#00BFFF"
        height={60}
        width={60}
      />
    </Flex>
  );
};

export default Loader;
