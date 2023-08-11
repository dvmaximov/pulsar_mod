import React from "react";
import ReactDOM from "react-dom";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ruRU } from "@mui/material/locale";
import ru from "date-fns/locale/ru";

import AppRouter from "./components/AppRouter";
import "./index.css";

import * as socket from "./services/socket.service";

const theme = createTheme(
  {
    palette: {
      primary: { main: "#1976d2" },
      bgGray: { main: "#f9f9f9" },
    },
  },
  ruRU
);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} locale={ru}>
        <AppRouter />
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
