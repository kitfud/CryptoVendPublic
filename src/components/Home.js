import React, { useState,useEffect } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent,Grid, CardHeader, CardMedia} from "@mui/material"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import VendingMachineImage from '../images/VendingMachineImage.png'

const Home = () => {

 

  return (
    <Box sx={{marginBottom:2}}>
 <Typography variant='h3' sx={{marginBottom:2,color:'#9e00c5'}}>
Web3 Hardware Solutions
 </Typography>

 <Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
 <Card variant='elevated' align='center' sx={{height:'75vh', marginTop:1,backgroundColor:'#9e00c5', width:1/2}}>
<CardHeader>
<Typography variant='h4' sx={{color:'white', marginTop:2}}> 

  </Typography>
</CardHeader>
<CardContent>


<CardMedia
component="img"
image={VendingMachineImage}
/>


</CardContent>
 </Card>
 </Grid>

    </Box>

  )
}

export default Home