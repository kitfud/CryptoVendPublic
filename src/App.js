
import './App.css';
import { createTheme, ThemeProvider, Container, Card, CardContent} from "@mui/material";
import {Routes, Route,Link, Redirect} from "react-router-dom";
import Home from './components/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ABI from "./chain-info/abi.json"
import ABIVending from "./chain-info/abiVending.json"
import Connect from './components/Connect';
import { useState, createContext } from "react";
import Sell from './components/Sell';

export const ContractContext = createContext();

const {REACT_APP_CONTRACTADDRESS: contractDeploymentAddress} = process.env


let theme = createTheme({
  palette: {
    primary: {
      main: '#9e00c5',
    },
    secondary: {
      main: '#00c853',
    },
  },
  typography: {
    fontFamily: "Lato"
  }
});

function App() {
  

  const cryptoVendAddress = contractDeploymentAddress
  const {abi} = ABI
  const {abiVending} = ABIVending


  const contractDetails = {
    address: cryptoVendAddress,
    abi: abi,
    abiVending: abiVending
  }

  return (
    <ContractContext.Provider value={contractDetails}>
   <ThemeProvider theme={theme}>
     <Container className="App">

  <Navbar/>
  <Card sx={{height:'90vh',backgroundColor:'#5efc82'}}>
  <CardContent>
  <Routes>
           <Route path="/" element={<Home/>}/> 
           <Route path="connect" element={<Connect/>}/>
           <Route path="sell" element={<Sell/>}/>
  </Routes>
  </CardContent>
      </Card>
      <Footer/>


     </Container>
   </ThemeProvider>
    </ContractContext.Provider>

  );
}

export default App;
