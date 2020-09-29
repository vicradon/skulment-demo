import { Box, Flex, Image } from "@chakra-ui/core";
import React from "react";
import { Link } from "react-router-dom";

const SidebarLink = ({ to, linksVisible, value, imageSrc, altText, transform }) => {
  return (
    <Link to={to}>
      <Flex align="center" my="2rem" color="brand.blue.800">
        <Image
          justifySelf="center"
          transform={transform}
          src={imageSrc}
          alt={altText || "sidebar icon"}
        />
        {linksVisible && (
          <Box as="span" ml="1rem">
            {value}
          </Box>
        )}
      </Flex>
    </Link>
  );
};

export default SidebarLink;
