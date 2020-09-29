import React from "react";
import faunadb, { query as q } from "faunadb";
import { Box, Image, Flex, Grid } from "@chakra-ui/core";
import { MdMenu, MdNotifications } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import logoComplete from "../assets/images/logo-complete.png";
import Tag from "../Components/Tag";
import { useAuth0 } from "@auth0/auth0-react";
import powerOffIcon from "../assets/icons/power-off-icon.svg";
import { capitalize } from "../services/sharedFunctions";

const SharedDashboardLayout = ({ children, secondaryChildren }) => {
  const blue300 = "#4abef7";
  const [linksVisible] = React.useState(true);

  const { logout, user } = useAuth0();

  const handleLogout = () => {
    const client = new faunadb.Client({
      secret: user["https://fauna.com/user_metadata"].secret,
    });
    client.query(q.Logout(true));
    logout();
  };

  return (
    <Box>
      <Box
        overflow="auto"
        width={linksVisible ? "200px" : "50px"}
        position="fixed"
        height="100%"
        justify="center"
        boxShadow="2px 2px 13px rgba(0, 0, 0, 0.25)"
        p={linksVisible ? "1rem" : 0}
      >
        <Grid
          templateColumns={linksVisible ? "1fr 11fr" : "1fr"}
        >
          <Box justifySelf="center">

          <MdMenu
            size={32}
            color="#0071BC"
          />
          </Box>

          {linksVisible && (
            <Image
              ml=".5rem"
              src={logoComplete}
              alt="skulment"
              transform="scale(0.8, 0.8)"
            />
          )}
        </Grid>
        <Flex direction="column" justify="center" h="80%">
          {React.cloneElement(children, { linksVisible })}
        </Flex>
        <Flex align="center" color="brand.blue.800">
          <Image justifySelf="center" transform="scale(0.7, 0.7)" src={powerOffIcon} alt="" />
          {linksVisible && (
            <Box cursor="pointer" as="span" ml="1rem" onClick={handleLogout}>
              Logout
            </Box>
          )}
        </Flex>
      </Box>
      <Box ml={linksVisible ? "200px" : "50px"} p="1.5rem">
        <Flex justify="space-between">
          <Flex align="center">
            <Box
              mr="1rem"
              as={FaUserCircle}
              w="50px"
              h="50px"
              color="brand.blue.900"
            />
            <Tag
              color={blue300}
              title={capitalize(user["https://fauna.com/user_metadata"].role)}
            />
          </Flex>
          <Box>
            <Box
              as={MdNotifications}
              w="30px"
              h="30px"
              color="brand.blue.900"
            />
          </Box>
        </Flex>
        <Box mt="2rem">{secondaryChildren}</Box>
      </Box>
    </Box>
  );
};

export default SharedDashboardLayout;
