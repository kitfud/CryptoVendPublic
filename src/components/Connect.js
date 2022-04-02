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

 useEffect(()=>{
  QrCode.toDataURL(contractaddress).then((data)=>{
    setSrc(data)
  })
 },[])

 
useEffect(()=>{
  if (contract){
contract.on("Deposit",(payee, value, time, contractBalance,event)=>{
let data = {
  payee: payee, 
  amount: value.toString(),
  time: time.toString(),
  contractBalance: contractBalance.toString(),
  event:event
}
console.log(data)
setDepositData(data)
contract.removeListener("Deposit",(payee,value,time,contractBalance,event))
})


contract.on("Withdraw", (time,amount,event)=>{
  let data = {
    time: time.toString(), 
    amount:amount.toString(),
    event:event
  }
  console.log(data)
  setWithdrawInfo(data)
  setDepositMade(true)
  setProcessing(false)
  contract.removeListener("Withdraw",(time,amount,event))
})



}},[contract])







const handleWithdrawBalance = async() =>{
setProcessing(true)
console.log("withdraw")
try{
await contract.ownerWithdraw();
}
catch{
  alert("error on withdraw.")
  setProcessing(false)
}

}


const WithdrawVendingBalanceButton = ()=>{
  return (
    <Box sx={{marginTop:0.5, marginBottom:2}}>
      <Button 
        variant="contained" 
        color="warning"
        onClick={handleWithdrawBalance} >Withdraw Balance</Button>
    </Box>
  )
}




  return (
    <div>
       
        <WalletConnect
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


        {
          contract ?   <>



        <HardwareConnect 
          setDepositMade={setDepositMade}
          depositData={depositData} 
          setDepositData={setDepositData}
            />


        {
          !processing?
          <WithdrawVendingBalanceButton/> 
          :<Box sx={{marginTop:2}}>
            <CircularProgress/>
            </Box>
        }

      

   

        </> 

        :null
        }
    


    </div>
  )
}

export default Connect