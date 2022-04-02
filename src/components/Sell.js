import React,{useEffect,useContext,useState} from 'react'
import QrCode from 'qrcode';
import {ContractContext } from '../App';
import {   Box,  Typography, Card, CardContent} from "@mui/material"
import { Link } from "react-router-dom";

const Sell = () => {

    const contractinfo = useContext(ContractContext)
    const contractaddress = contractinfo.address;

    const [src, setSrc]  = useState('');
    const [machineConnected, setMachineConnected] = useState(false)

    useEffect(()=>{
        QrCode.toDataURL(contractaddress).then((data)=>{
          setSrc(data)
        })
        if (window.sessionStorage.getItem("hardwareConnectColor")){
            setMachineConnected(true)
        }
       },[])

    
    const QRComponent = () =>{
return(
        machineConnected ?  
        <Box>
        <Typography variant="h4" sx={{marginBottom:2}}>Scan To Buy:</Typography>
        <img src={src}/>
        </Box>: 
        <Link to="/connect">
        <Typography variant='h4' sx={{marginTop:2, color:'#9e00c5'}}>CONNECT VENDING MACHINE TO SELL</Typography>
        </Link>
)
    }


    return (       
        <QRComponent/>
            )
}

export default Sell