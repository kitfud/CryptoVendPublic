import React, { useState, useEffect,useContext,createContext,useRef } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent} from "@mui/material"
import { ethers } from 'ethers'
import { ContractContext } from '../../App';

export const WalletContext = createContext();

const WalletConnect = ({
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
    const userProvier = useRef(null)
    const userSigner = useRef(null)
    const userContract = useRef(null)

    const [connButtonText, setConnButtonText] = useState('Connect Wallet');
    const [accountchanging, setAccountChanging] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null);
    const [connectButtonColor, setConnectButtonColor] = useState("primary")
    const [processing, setProcessing] = useState(false)
    const [contractbalance, setContractBalance] = useState(null)
    const [recentDeposit, setRecentDeposit] = useState(null)

    const abi = contractinfo.abi
    const address = contractinfo.address

  

    
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
        if(contract){
        let contractBalance = await contract.getBalance();
        setContractBalance(ethers.utils.formatEther(contractBalance));
        }
    }

    useEffect(()=>{
        if (depositMade===true){
        getContractBalance()
        setDepositMade(false)
        }
    },[depositMade])

    useEffect(()=>{
        if (recentDeposit !== depositData){
        setRecentDeposit(depositData)
        getContractBalance()
        }
    },[depositData])


    useEffect(() => {

        getWalletBalance(provider)
        getContractBalance()

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



    useEffect(()=>{
if(window.sessionStorage.getItem('userAccount') !== null){
    setDefaultAccount(window.sessionStorage.getItem('userAccount'))
    setConnButtonText('Wallet Connected');
    updateEthers();
}

    },[])



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
                                <Typography variant="h2" sx={{ fontSize: 15 }}>Vending Machine Balance: {contractbalance} </Typography>
                      
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