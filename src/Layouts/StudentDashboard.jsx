import React from "react";
import { Box } from "@chakra-ui/core";

import homeIcon from "../assets/icons/home-icon.png";
import coursesIcon from "../assets/icons/books.svg";

import SharedDashboardLayout from "./SharedDashboardLayout";
import SidebarLink from "../Components/SidebarLink";

const StudentDashboardLayout = ({ children }) => {
  const Links = ({ linksVisible }) => {
    return (
      <Box>
        <SidebarLink
          value="Home"
          to="/"
          imageSrc={homeIcon}
          altText="home icon"
          transform="scale(0.9, 0.9)"
          linksVisible={linksVisible}
        />
        <SidebarLink
          value="Courses"
          to="/courses"
          imageSrc={coursesIcon}
          altText="books icon"
          transform="scale(0.7, 0.7)"
          linksVisible={linksVisible}
        />
      </Box>
    );
  };
  return (
    <SharedDashboardLayout secondaryChildren={children}>
      <Links />
    </SharedDashboardLayout>
  );
};

export default StudentDashboardLayout;
