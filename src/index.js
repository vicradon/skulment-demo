import { Auth0Provider } from "@auth0/auth0-react";
import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import theme from "./theme";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <React.Fragment>
    <Auth0Provider
      domain={process.env.REACT_APP_DOMAIN}
      clientId={process.env.REACT_APP_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <ThemeProvider theme={theme}>
        <CSSReset />
        <App />
      </ThemeProvider>
    </Auth0Provider>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
