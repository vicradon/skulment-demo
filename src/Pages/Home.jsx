
import React from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/core";
import logo from "../assets/images/logo-complete.png";
import { useAuth0 } from "@auth0/auth0-react";

const Home = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Box>
      <Box style={{ height: "100vh" }} background={`url(landing-image.png)`}>
        <Flex m="auto" p="3rem" w="90%" align="center" justify="space-between">
          <img src={logo} alt="logo" />
          <Button
            variantColor="orange.800"
            bg="brand.orange.800"
            onClick={loginWithRedirect}
          >
            Sign in
          </Button>
        </Flex>

        <Flex
          m="auto"
          h="70%"
          direction="column"
          justify="center"
          align="center"
        >
          <Heading color="white" textAlign="center">
            Demo school management system with
          </Heading>
          <Heading color="white" textAlign="center">
            FaunaDB awesomeness
          </Heading>
          <Button
            my="2rem"
            variantColor="orange.800"
            bg="brand.orange.800"
            w="100px"
            onClick={loginWithRedirect}
          >
            Sign in
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default Home;
