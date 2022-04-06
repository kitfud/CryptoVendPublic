import React, { useState,useEffect,useContext } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent,Grid, CardHeader, CardMedia, Snackbar, Alert, Link} from "@mui/material"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import VendingMachineImage from '../images/VendingMachineImage.png'
import {ContractContext } from '../App';
import { ethers, Signer } from 'ethers'
import { MovingSharp, PermPhoneMsg } from '@mui/icons-material';

const Home = () => {

  const contractinfo = useContext(ContractContext)

  const abi = contractinfo.abi;
  const contractaddress = contractinfo.address;

  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [contract, setContract] = useState(null)
  const [nftPrice, setNFTPrice] = useState(null)
  const [tokenMinted, setTokenMinted] = useState(false)
  const [tokencontractaddress, setTokenAddress] = useState(null)
  const [tokencount, setTokenCount] = useState(null)

  const updateEthers = async () => {
    
    let tempProvider = await new ethers.providers.Web3Provider(window.ethereum);
    setProvider(tempProvider);

    let tempSigner = await tempProvider.getSigner();
    setSigner(tempSigner);

    let tempContract = await new ethers.Contract(contractaddress, abi, tempSigner);
    setContract(tempContract);
}

const getNFTPrice = async () =>{
if (contract !== null){
let price =  await contract.currentNFTPrice();
let ethPrice = ethers.utils.formatEther(price)
setNFTPrice(ethPrice)
  }
}

const getTokenCount = async ()=>{
  if(contract !== null){
  let count =  await contract.tokenCount()
  setTokenCount(count.toNumber())
  return count
  }
}

const getTokenAddress = async ()=>{
  if(contract!==null){
    let address = await contract.tokenFactory()
    setTokenAddress(address)
  }
}



useEffect(()=>{

updateEthers()
},[])

useEffect(()=>{
getNFTPrice()
getTokenCount()
getTokenAddress()
},[contract])

useEffect(()=>{
getTokenCount()
},[tokenMinted])

const handleMint = async()=>{
  let price = ethers.utils.parseEther(nftPrice);
  console.log("minting NFT at price: "+ price.toString())
  let tx = await contract.mintAgreement({
    "value":price
  })
  console.log(tx)
  setTokenMinted(true)
}

const handleCloseSnack = ()=>{
  setTokenMinted(false)
}

const NFTReceipt = ()=>{
  return (
    <Snackbar open={tokencount && tokenMinted} autoHideDuration={8000} onClose={handleCloseSnack}>
    <Alert onClose={handleCloseSnack} severity="success">
        <Link target="_blank" rel="noopener noreferrer" href={`https://testnets.opensea.io/assets/${tokencontractaddress}/${tokencount+1}`}>View NFT HERE (refresh page as needed): {`https://testnets.opensea.io/${tokencontractaddress}/${tokencount+1}`} </Link>
    </Alert>
    </Snackbar>
  )
}

  return (

<Box sx={{marginBottom:2}}>


  <NFTReceipt/>
 
 
 <Typography variant='h3' sx={{marginBottom:2,color:'#9e00c5'}}>
Web3 Hardware Solutions
 </Typography>

 <Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
 <Card variant='elevated' align='center' sx={{height:'85vh', marginTop:1,backgroundColor:'#9e00c5', width:1/2}}>
<CardHeader>
<Typography variant='h4' sx={{color:'white', marginTop:2}}> 

  </Typography>
</CardHeader>
<CardContent>
<Card>
<Typography>Price: {nftPrice} ETH</Typography>
</Card>

<CardMedia
component="img"
image={VendingMachineImage}
/>

<Button variant="contained" color="success" sx={{marginTop:2}} onClick={handleMint}>
  MINT A VENDING MACHINE
</Button>
</CardContent>
 </Card>
 </Grid>

    </Box>

  )
}

export default Home