import React from "react";
import { Box, Image, Flex } from "@chakra-ui/core";
import { Link } from "react-router-dom";

import homeIcon from "../assets/icons/home-icon.png";
import coursesIcon from "../assets/icons/books.svg";
import SharedDashboardLayout from "./SharedDashboardLayout";

const TeacherDashboardLayout = ({ children }) => {
  return (
    <SharedDashboardLayout secondaryChildren={children}>
      <Box>
        <Flex align="center" my="2rem" color="brand.blue.800">
          <Image transform="scale(0.7, 0.7)" src={homeIcon} alt="home icon" />
          <Box as="span" ml="1rem">
            <Link to="/">Home</Link>
          </Box>
        </Flex>
        <Flex align="center" my="2rem" color="brand.blue.800">
        <Image transform="scale(0.6, 0.6)" src={coursesIcon} alt="" />
          
          <Box as="span" ml="1rem">
            <Link to="/courses">Courses</Link>
          </Box>
        </Flex>
      </Box>
    </SharedDashboardLayout>
  );
};

export default TeacherDashboardLayout;
