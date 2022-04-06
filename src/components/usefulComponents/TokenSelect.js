import React,{useEffect,useState} from 'react'
import VendingMachineImage from './VendingMachineImage.png'
import {  Button, CircularProgress, Box,  Typography, Card, CardContent, CardMedia,Grid} from "@mui/material"

const TokenSelect = ({machineStatus,tokenselect,tokensheld,defaultAccount,vendingcontract,handleTokenSelect,handleTokenDisconnect,tokenholder}) => {

const TOKENSELECTER = () =>{
    return (
        !tokenselect?
        tokensheld.map((item)=>{
            if (item !== 0){
            return (
                <Box key={item} sx={{display:'inline-block', paddingLeft:1,paddingRight:1}}>
                <Card sx={{width:150, height:250}}>
                <CardMedia
                component="img"
                image={VendingMachineImage}
                />
                <CardContent>
                <Typography>Token: {item}</Typography>
                </CardContent>
                <Button variant='contained' color='success' onClick={(e)=>handleTokenSelect(item)}>CONNECT</Button>
                </Card>
               
                </Box>)
            }
        })
        
        :
        <>
        <Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
        <Box> 
        <Card sx={{width:150, height:250}}>
        <CardMedia
        component="img"
        image={VendingMachineImage}
        />
        <Typography>Token: {vendingcontract}</Typography>
        {
            machineStatus? <Box sx={{marginTop:'2px'}}>
                <Card>Machine Connected</Card>
            </Box> : <Button variant='contained' color='error' onClick={handleTokenDisconnect}>DISCONNECT</Button>
        }
       
        
        </Card>
        </Box>
        </Grid>
    
        </>
        
    )
}
    
  return (
     tokenholder? 
   <TOKENSELECTER/>: null
    
  )
}

export default TokenSelect