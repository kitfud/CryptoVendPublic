import React, { useEffect } from 'react'
import { useState, createContext, useContext } from "react";
import {ContractContext } from '../App';
import WalletConnect from './usefulComponents/WalletConnect';
import { ethers } from 'ethers'
import HardwareConnect from './testComponents/HardwareConnect';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent, Tabs, Tab} from "@mui/material"
import QrCode from 'qrcode';



const Connect = () => {

 const contractinfo = useContext(ContractContext)

 const [defaultAccount, setDefaultAccount] = useState(null);
 const [walletBalance, setWalletBalance] = useState(null);
 const [signer, setSigner] = useState(null);
 const [contract, setContract] = useState(null);
 const [provider, setProvider] = useState(null);
 const [depositData, setDepositData] = useState(null);
 const [withdrawInfo, setWithdrawInfo] = useState(null);
 const [depositMade, setDepositMade] = useState(false);
 const [processing, setProcessing] = useState(false);
 const [contractbalance, setContractBalance] = useState(null);
 const [tabValue, setTabValue] = useState(0);


 const abi = contractinfo.abi;
 const contractaddress = contractinfo.address;

 const [src, setSrc]  = useState('');


  return (
    <div>
       
        <WalletConnect
        signer = {signer}
        depositData = {depositData}
        setDepositMade={setDepositMade}
        depositMade={depositMade}
        contract = {contract}
        defaultAccount={defaultAccount}
        setDefaultAccount={setDefaultAccount}
        walletBalance={walletBalance}
        setWalletBalance={setWalletBalance}
        setSigner = {setSigner}
        setContract={setContract}
        provider = {provider}
        setProvider={setProvider}     
        />


      
    


    </div>
  )
}

export default Connect