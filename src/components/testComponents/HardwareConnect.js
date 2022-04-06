import React, { useState,useEffect } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, Grid} from "@mui/material"
import {connect} from "simple-web-serial";

const HardwareConnect = ({setMachineStatus,depositData}) => {
    const [connection, setConnection] = useState(false);
    const [buttoncolor, setButtonColor] = useState("primary")
    const [connectionStatus, setConnectionStatus] = useState(false)
    
  
  
    const handleConnect = ()=>{
      setConnection(connect(57600))
      setConnectionStatus(true)
      setMachineStatus(true)
      setButtonColor("success")
   
     
    }


    useEffect(()=>{
      console.log("IN HARDWARE COMPONENT")
      console.log("DEPOSIIT DATA: "+ depositData)
    
      if(depositData !== null && connectionStatus === true && connection !== null){
      console.log("DEPOSIT MADE-MACHINE TRIGGERED")
      connection.send("paymentMade",true)  
    }

 
     
    },[depositData])

 
  
    const handleDisconnect = ()=>{
    setButtonColor("primary")
    setConnectionStatus(false)
    console.log("disonnect")
    window.location.reload(false)
    }
  
  
    const ConnectButton = ()=>{
      return( 
           <Box>
          <Button variant="contained" color="primary" onClick={handleConnect}>
          CONNECT Vending Machine
          </Button>
             </Box>    
      )
    }
  
    const Disconnect= ()=>{
      return (
        <>
      
      <Box>
      <Button 
      variant="contained" 
      color="error"
      sx={{marginTop:"2px", marginBottom:"10px"}}
      onClick={handleDisconnect}
      >
        Disconnect Machine
      </Button>
      </Box>
        
        </>
      )
    }
  
  
    return (
    <>
     
    {

    connectionStatus === false? 
            <ConnectButton/>:
                <Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
                <Card sx={{width:1/2, backgroundColor: '#84ffff' }}>
                    <Typography component="span">Vending Machine Connected</Typography>
                    <Disconnect/>
                </Card>
                </Grid>
   
    
    }
  
   
   
    </>
    )
  }

export default HardwareConnect