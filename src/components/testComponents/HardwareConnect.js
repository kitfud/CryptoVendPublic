import React, { useState,useEffect } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent,Grid} from "@mui/material"
import {connect} from "simple-web-serial";

const HardwareConnect = ({depositData}) => {
    const [connection, setConnection] = useState(null);
    const [buttontext, setButtonText] = useState("Click TO COM CONNECT")
    const [buttoncolor, setButtonColor] = useState("primary")
    const [machineDataState, setMachineData] = useState(null);
    const [processing,setProcessing] = useState(false)
  
  
    const handleConnect = ()=>{
      setConnection(connect(57600))
      setButtonText("COM CONNECTED")
      setButtonColor("success")
      window.sessionStorage.setItem("hardwareConnectColor","success")
      setProcessing(false)
    }
  

    useEffect(()=>{
      if(depositData && connection !==null){
      setMachineData(depositData)
      console.log("DEPOSIT MADE-MACHINE TRIGGERED")
      connection.send("paymentMade",true)  
    }
     
    },[depositData])


    useEffect(()=>{
      if(window.sessionStorage.getItem('hardwareConnectColor')=='success'){
        setButtonColor("success")
      }
     
    },[])
  
  
    const handleDisconnect = ()=>{
    setButtonColor("primary")
    window.sessionStorage.clear('hardwareConnectColor')
    window.sessionStorage.clear('userAccount')
    window.sessionStorage.clear('tokenSelect')
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
      sx={{marginTop:"20px"}}
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
    buttoncolor === "primary"? 
  <ConnectButton/>:
<Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
<Card sx={{width:1/5, backgroundColor: '#84ffff' }}>
    <Typography component="span">Vending Machine Connected</Typography>
    </Card>
</Grid>
   
    
    }
  
  {
    buttoncolor === "success"?
  <Disconnect/>:null
  }
   
    </>
    )
  }

export default HardwareConnect