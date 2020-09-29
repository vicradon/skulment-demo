import React from "react";

import { Box, useTheme } from "@chakra-ui/core";

const Tag = ({ title, color }) => {
  const theme = useTheme();
  return (
    <Box as="span" color="white" borderRadius="100px" px="10px" bg={color || theme.colors.brand.blue['800']}>
      {title}
    </Box>
  );
};

export default Tag;
