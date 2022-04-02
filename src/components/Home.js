import React, { useState,useEffect } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent,Grid, CardHeader} from "@mui/material"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

const Home = () => {

 

  return (
    <Box>
 <Typography variant='h3' sx={{marginBottom:2,color:'#9e00c5'}}>
Web3 Hardware Solutions
 </Typography>
 <AttachMoneyIcon sx={{color:'#9e00c5'}} fontSize='large'/>
 <Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
 <Card variant='elevated' align='center' sx={{height:'40vh', marginTop:2, backgroundColor:'#9e00c5', width:1/2}}>
<CardHeader>
<Typography variant='h4' sx={{color:'white', marginTop:2}}> 

  </Typography>
</CardHeader>
<CardContent>


  <Typography variant='h4' sx={{color:'white', marginTop:3}}>
Client Side Automated Vending
  </Typography>
<PrecisionManufacturingIcon fontSize='large' sx={{marginTop:2,color:'white'}}/>
</CardContent>
 </Card>
 </Grid>

    </Box>

  )
}

export default Home