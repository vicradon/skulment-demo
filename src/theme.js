import { theme } from "@chakra-ui/core";

const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      blue: {
        900: "#03519a",
        800: "#0071BC",
        700: "#0082d0",
        600: "#0095e4",
        500: "#00a2f3",
        400: "#20b0f6",
        300: "#4abef7",
        200: "#7ed0fb",
        100: "#b2e3fd",
        50: "#e0f4fe",
      },
      orange: {
        800: "#F7931E",
      },
      green: {
        800: "#56C064",
      },
      red: {
        800: "#ED1C24",
      },
      gray: {
        300: "#E6E6E6",
      },
    },
    typography: {
      "gray-1": "#404040",
    },
  },
};

export default customTheme;
