import React from "react";
import { Link } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton
} from '@mui/material'
import StorefrontIcon from '@mui/icons-material/Storefront';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    navlinks: {
      marginLeft: theme.spacing(5),
      display: "flex",
    },
    logo: {
      flexGrow: "1",
      cursor: "pointer",
    },
    link: {
      textDecoration: "none",
      color: "white",
      fontSize: "20px",
      marginLeft: theme.spacing(20),
      "&:hover": {
        color: "yellow",
        borderBottom: "1px solid white",
      },
    },
  }));

const Navbar =() => {

    const classes = useStyles();

  return (
      <>
         <AppBar position="static">
      <CssBaseline />
      <Toolbar>
        <IconButton href="/">
        <Typography variant="h4" className={classes.logo} color="white">
         CryptoVend 
        </Typography>
        <StorefrontIcon fontSize="large" sx={{marginLeft:1, color:'white'}}></StorefrontIcon>
        </IconButton>
      
      
          <div className={classes.navlinks} >
            <Link to="/" className={classes.link}>
              HOME
            </Link>     
          </div> 

             <div className={classes.navlinks} >
            <Link to="connect" className={classes.link}>
              CONNECT
            </Link>     
          </div>   


    

      </Toolbar>
    </AppBar>
      
      </>
 
  );
}
export default Navbar;