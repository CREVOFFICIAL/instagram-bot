import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import store from "../store";
import "./index.css";
import Routes from "../Routes";

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  document.getElementById("root")
);
