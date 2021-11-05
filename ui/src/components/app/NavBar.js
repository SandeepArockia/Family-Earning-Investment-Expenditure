import * as React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div style={{display: 'flex', alignItems: 'center', height: '50px', background: '#2196F3ee', color: "white", padding: '10px' }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Earning Investment Expenditure
        </Typography>
      <div>

        <Link to="user" style={{ color: "white", textDecoration: "none" }}>
          <Button color="inherit">Users</Button>
        </Link>
        <Link
          to="transaction"
          style={{ color: "white", textDecoration: "none" }}
        >
          <Button color="inherit">Transaction</Button>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
