import React,{useEffect,useContext,useState} from 'react'
import QrCode from 'qrcode';
import {ContractContext } from '../App';
import {   Box,  Typography, Card, CardContent} from "@mui/material"
import { Link } from "react-router-dom";
import { ethers } from 'ethers'
import HardwareConnect from './testComponents/HardwareConnect'

const Sell = ({contractaddress}) => {

    const contractinfo = useContext(ContractContext);
    const abiVending = contractinfo.abiVending

    const [src, setSrc]  = useState('');
    const [machineConnected, setMachineConnected] = useState(false)
    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)
    const [datastream, setDataStream] = useState(null);  

    const updateEthers = async () => {
        let tempProvider = await new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);
    
        let tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);
    
        let tempContract = await new ethers.Contract(contractaddress, abiVending, tempProvider);
        setContract(tempContract);
    
    }


    useEffect(()=>{
        if(contractaddress !== null){
            console.log("CONTRACT ADDRESS AVAILABLE")
            updateEthers()

        QrCode.toDataURL(contractaddress).then((data)=>{
            setSrc(data)
        })
        }

        },[contractaddress])

      

    
    const QRComponent = () =>{
    return(
            contractaddress ?  
            <>
            <Box>
            <Typography variant="h4" sx={{marginBottom:2}}>Scan To Buy:</Typography>
            <Typography variant="h5">{contractaddress}</Typography>
            <img src={src}/>
            </Box>
            <Box sx={{marginTop:2}}>
            
            
            </Box>
            
        
            </>
            : 
            <Link to="/connect">
            <Typography variant='h4' sx={{marginTop:2, color:'#9e00c5'}}>CONNECT NFT TO SELL</Typography>
            </Link>
    )
        }


    return (       
        <QRComponent/>
            )
}

export default Sell