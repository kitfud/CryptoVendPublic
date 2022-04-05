import React, { useState, useEffect,useContext,createContext,useRef } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent, CardMedia,Grid} from "@mui/material"
import { ethers } from 'ethers'
import { ContractContext } from '../../App';
import VendingMachineImage from './VendingMachineImage.png'

export const WalletContext = createContext();

const WalletConnect = ({
    signer,
    location,
    depositData,
    setDepositMade,
    depositMade,
    contract,
    defaultAccount,
    setDefaultAccount,
    walletBalance,
    setWalletBalance,
    setSigner,
    setContract,
    provider,
    setProvider
}) => {

    const contractinfo = useContext(ContractContext);

    const userAccount = useRef(null)
 

    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [accountchanging, setAccountChanging] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const [connectButtonColor, setConnectButtonColor] = useState("primary")
    const [processing, setProcessing] = useState(false)
    const [contractbalance, setContractBalance] = useState(null)
    const [recentDeposit, setRecentDeposit] = useState(null)
    const [tokenholder, setIsTokenHolder] = useState(false)
    const [tokensheld, setTokensHeld] = useState([])
    const [vendingcontract, setVendingContract] = useState(null)
    const [tokenselect, setTokenSelect] = useState(false)
    const [vendingaddress, setVendingAddress] = useState(null)
    const [vendContract, setVendContract] = useState(null)
    const [depositdata, setDepositData] = useState(null)

    const abi = contractinfo.abi
    const address = contractinfo.address
    const abiVending = contractinfo.abiVending

   
    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {
            console.log("CONNECTING TO WALLET")
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(result => {
    
                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');
                    setConnectButtonColor("success")
                })
                .catch(error => {
                    setErrorMessage(error.message);
    
                });
    
        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }
    
    const accountChangedHandler = (newAccount) => {
        if (!accountchanging) {
            setAccountChanging(true)
            checkAccountType(newAccount);
            setDefaultAccount(userAccount.current);
            updateEthers();
        }
    
    }
    
    const checkAccountType = (newAccount) => {
        if (Array.isArray(newAccount)) {
            window.sessionStorage.setItem('userAccount', newAccount[0].toString())
            userAccount.current = newAccount[0].toString()
       
        }
        else {
            window.sessionStorage.setItem('userAccount', newAccount)
            userAccount.current = newAccount
        }
    }
    
    const updateEthers = async () => {
        let tempProvider = await new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);
    
        let tempSigner = await tempProvider.getSigner();
        setSigner(tempSigner);
    
        let tempContract = await new ethers.Contract(address, abi, tempSigner);
        setContract(tempContract);
    
    }

    const eventListenerConnect = async ()=>{
        if(vendingaddress !== null){
        console.log("address: " + vendingaddress)
        console.log(JSON.stringify(abiVending))
        let vendContract = await new ethers.Contract(vendingaddress, abiVending,provider)
        console.log(vendContract)
        setVendContract(vendContract)
        }
    }

useEffect(()=>{
console.log("event listner connect")
eventListenerConnect()

},[vendingaddress])

useEffect(()=>{
console.log("vend connect")
if(vendContract!==null){
    console.log("EVENT LISTENER ACTIVE")
    vendContract.on("Deposit",(payee, value, time, contractBalance,event)=>{
        let data = {
          payee: payee, 
          amount: value.toString(),
          time: time.toString(),
          contractBalance: contractBalance.toString(),
          event:event
                    }
        setDepositData(data)
        vendContract.removeListener("Deposit",(payee,value,time,contractBalance,event))
       
                })
}

}, [vendContract])


useEffect(()=>{
console.log("UPDATAE IN DEPOSIT DATA")
getContractBalance()
},[depositdata])

    const chainChangedHandler = () => {
        // reload the page to avoid any errors with chain change mid use of application
        window.location.reload();
    }

    const getWalletBalance = async (provider) => {
        // Look up the balance
        if (provider !== null && !processing && defaultAccount !== null) {
            let balance = await provider.getBalance(defaultAccount);
            setWalletBalance(ethers.utils.formatEther(balance))
        }

    }

    const getContractBalance = async()=>{
        if(vendingcontract !== null){
        let contractBalance = await contract.getBalance(vendingcontract);
        setContractBalance(ethers.utils.formatEther(contractBalance));
        }
    }

    const tokenHolderCheck = async()=>{
        if (contract !== null && defaultAccount !== null){
          let holder =  await contract.checkIfTokenHolder(defaultAccount)
          console.log(holder)
          setIsTokenHolder(holder)
          
          if (holder){
            let holdingTokens = await contract.addressToTokenID(defaultAccount)
            let tokenNums = []
            holdingTokens.forEach(element=> tokenNums.push(element.toNumber()))
            console.log(tokenNums)
            setTokensHeld(tokenNums)
          }
        }
    }

    const getVendingContract = async (select)=>{
        let contractAddress = await contract.getVendingContractAddressByToken(select)
        console.log(contractAddress)
        setVendingContract(select)
        setVendingAddress(contractAddress)
    }

    const handleTokenSelect = (select) =>{
      getVendingContract(select)
      setTokenSelect(true)
    }

    const handleTokenDisconnect = ()=>{
        setTokenSelect(false)
        setVendingContract(null)
        setVendingAddress(null)
    }


    const TokenSelect = ()=>{
        return (
            !tokenselect?
            tokensheld.map((item)=>{
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
            }):
            <Grid sx={{alignItems:"center",display:'flex', flexDirection:'column'}}>
            <Box> 
            <Card sx={{width:150, height:250}}>
            <CardMedia
            component="img"
            image={VendingMachineImage}
            />
            <Typography>Token: {vendingcontract}</Typography>
            <Button variant='contained' color='error' onClick={handleTokenDisconnect}>DISCONNECT</Button>
            </Card>
            </Box>
            </Grid>
        )
    }

 
    useEffect(()=>{
if(vendingcontract!==null){
    getContractBalance()
}
    },[vendingcontract])


    useEffect(() => {

        getWalletBalance(provider)
        tokenHolderCheck()

    }, [provider,walletBalance])

    useEffect(() => {
        if (accountchanging === false) {
            // listen for account changes
            window.ethereum.on('accountsChanged', accountChangedHandler);
            window.ethereum.on('chainChanged', chainChangedHandler);
        }
        else {
            window.ethereum.removeListener('accountsChanged', accountChangedHandler);
            window.ethereum.removeListener('chainChanged', chainChangedHandler);
        }

    }, [accountchanging])



  return (
      <>
     
    <Box>
    <Button onClick={connectWalletHandler} color={connectButtonColor} variant="contained" sx={{ margin: 2 }}>{connButtonText}</Button>
    </Box>

    {
                defaultAccount ? (

                    <>
                        
                        <Card variant="outlined" sx={{ display: 'inline-block', backgroundColor: "lightgreen" }}>
                            <CardContent>
                                <Typography variant="h2" sx={{ fontSize: 15 }}>Address: {defaultAccount}</Typography>
                                <Typography variant="h2" sx={{ fontSize: 15 }}>Wallet Balance: {walletBalance}</Typography>
                                <Typography variant="h2" sx={{ fontSize: 15 }}>Is token holder: {tokenholder.toString()}</Typography>
                                <Typography variant="h2" sx={{ fontSize: 15 }}>Tokens: {JSON.stringify(tokensheld)}</Typography>
                                <TokenSelect/>
                                {tokenselect ?
                                <>
                                 <Typography variant="h2" sx={{ fontSize: 15 }}>Contract Address: {vendingaddress}</Typography>
                                <Typography variant="h2" sx={{ fontSize: 15, marginTop:2}}>Vending Machine Balance:{contractbalance}</Typography>
                                </>
                               :null
                                }
                            </CardContent>
                        </Card>
                        
                       

                    </>

                ) :

                
                    (
                        <Typography>
                            {errorMessage}
                        </Typography>
                    )
            }
           

      </>
   
    
  )
}

export default WalletConnect