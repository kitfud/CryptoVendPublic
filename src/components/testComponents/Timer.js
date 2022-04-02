import React, { useState,useEffect } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent} from "@mui/material"
import {connect, disconnect} from "simple-web-serial";

const Timer = () => {
    const [connection, setConnection] = useState(null);
    const [buttontext, setButtonText] = useState("Click TO COM CONNECT")
    const [buttoncolor, setButtonColor] = useState("primary")
    const [datainput, setData] = useState(null);
  
    const handleConnect = ()=>{
     
      setConnection(connect(9600))
      setButtonText("COM CONNECTED")
      setButtonColor("success")
    }
  
    const handleValue=(data)=>{
      console.log("data: "+ data)
      setData(data)
    }
  
    useEffect(()=>{
      if(connection){
        connection.on("value",handleValue)
      }
    },[connection])
  
  
    const handleDisconnect = ()=>{
  
    console.log("disonnect")
    window.location.reload(false)
    }
  
    const handleSendStart = ()=>{
      connection.send("start",true)
    }
  
    const handleSendStop = ()=>{
      connection.send("stop",false)
    }
  
    const ConnectButton = ()=>{
      return(
        <Box>
        <Button variant="contained" color="primary" onClick={handleConnect}>
        CLICK TO CONNECT TO COM
        </Button>
           </Box>
      )
    }
  
    const StartStopButtons= ()=>{
      return (
        <>
        <Box>
      {
            datainput? 
            datainput:null  
          }
      </Box>
      <Button 
      variant="contained" 
      color="success"
      sx={{marginTop:"20px", marginRight:0.5}}
      onClick={handleSendStart}
      >
        Start Data
      </Button>
      <Button 
      variant="contained" 
      color="error"
      sx={{marginTop:"20px", marginLeft:0.5, backgroundColor:"#ff7d47"}}
      onClick={handleSendStop}
      >
        Stop Data
      </Button>
      
      <Box>
      <Button 
      variant="contained" 
      color="error"
      sx={{marginTop:"20px"}}
      onClick={handleDisconnect}
      >
        Disconnect
      </Button>
      </Box>
        
        </>
      )
    }
  
  
    return (
    <>
  
    {
      buttoncolor === "primary"? 
  <ConnectButton/>:null
    }
  
  {
    buttoncolor === "success"?
  <StartStopButtons/>:null
  }
   
    </>
    )
  }

export default Timer