import * as React from "react";
import { Box } from "@mui/material";
import NavBar from "./NavBar";
import ManageTransaction from "../transaction/ManageTransaction";
import { Route, Switch } from "react-router-dom";

const App = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar />
      <Switch>
        <Route path="/transaction/:id?">
          <ManageTransaction />
        </Route>
      </Switch>
    </Box>
  );
};

export default App;
