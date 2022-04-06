import React, { useState, useEffect,useContext,createContext,useRef } from 'react';
import {  Button, CircularProgress, Box,  Typography, Card, CardContent, CardMedia,Grid} from "@mui/material"
import { ethers } from 'ethers'
import { ContractContext } from '../../App';
import VendingMachineImage from './VendingMachineImage.png'
import HardwareConnect from '../testComponents/HardwareConnect';
import TokenSelect from './TokenSelect';
import Sell from '../Sell';


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
    const [tokenholder, setIsTokenHolder] = useState(false)
    const [tokensheld, setTokensHeld] = useState([])
    const [vendingcontract, setVendingContract] = useState(null)
    const [tokenselect, setTokenSelect] = useState(false)
    const [vendingaddress, setVendingAddress] = useState(null)
    const [vendContract, setVendContract] = useState(null)
    const [depositdata, setDepositData] = useState(null)
    const [withdrawdata, setWithdrawData] = useState(null)
    const [machineStatus, setMachineStatus] = useState(false)
 

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
        window.sessionStorage.clear('userAccount')
      
     
        if (!accountchanging) {
            setAccountChanging(true)
            checkAccountType(newAccount);
            setDefaultAccount(userAccount.current);
            window.sessionStorage.setItem('userAccount',userAccount.current)
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
       
        // console.log(JSON.stringify(abiVending))
        let vendContract = await new ethers.Contract(vendingaddress, abiVending,signer)
        // console.log(vendContract)
        setVendContract(vendContract)
        }
    }



    const chainChangedHandler = () => {
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
        if(vendContract !== null){
        let contractBalance = await vendContract.getBalance({from:defaultAccount});
        setContractBalance(ethers.utils.formatEther(contractBalance));
        }
    }

    const tokenHolderCheck = async()=>{
        if (contract !== null && defaultAccount !== null){
          let holder =  await contract.checkIfTokenHolder(defaultAccount)
          console.log("is holder: "+ holder)
          setIsTokenHolder(holder)
          
          if (holder){
            let holdingTokens = await contract.addressToTokenID(defaultAccount)
            let tokenNums = []
            holdingTokens.forEach(element=> {if(element.toNumber() !==0){tokenNums.push(element.toNumber())}})
            console.log(tokenNums)
            setTokensHeld(tokenNums)
          }
        }
    }

    const getVendingContract = async (select)=>{
        if(select !== null && contract !== null){
        let contractAddress = await contract.getVendingContractAddressByToken(select)
        console.log(contractAddress)
        setVendingContract(select)
        setVendingAddress(contractAddress)
        window.sessionStorage.setItem('vendingContractAddress',contractAddress)
        }
    }

    const handleTokenSelect = (select) =>{
      window.sessionStorage.setItem('tokenSelect',select)
      getVendingContract(select)
      setTokenSelect(true)
    }

    const handleTokenDisconnect = ()=>{
        window.sessionStorage.setItem('tokenSelect',null)
        window.sessionStorage.clear('vendingContractAddress')
        setTokenSelect(false)
        setVendingContract(null)
        setVendingAddress(null)
    }




    const WithdrawVendingBalanceButton = ()=>{
        return (
            !processing?
          <Box sx={{marginTop:0.5, marginBottom:2}}>
            <Button 
              variant="contained" 
              color="warning"
              onClick={handleWithdrawBalance} >Withdraw Balance</Button>
          </Box>:<CircularProgress sx={{marginTop:1}}/>
        )
      }

      const handleWithdrawBalance = async() =>{
        setProcessing(true)
        console.log("withdraw")
        try{
        await vendContract.ownerWithdraw();
        }
        catch{
          alert("error on withdraw.")
          setProcessing(false)
        }
        
        }

        useEffect(()=>{
            console.log("event listner connect")
            eventListenerConnect()
            
            },[vendingaddress])
        
        const [datastream, setDataStream] = useState(null);     

        useEffect(()=>{
            let mounted = true; 
            if(vendContract!==null && mounted){
                getContractBalance()
                console.log("EVENT LISTENER ACTIVE")

                vendContract.on("Deposit",(payee, value, time, contractBalance,event)=>{
                    let data = {
                      payee: payee, 
                      amount: value.toString(),
                      time: time.toString(),
                      contractBalance: contractBalance.toString(),
                      event:event
                                }
                   if(datastream !== data){
                    setDataStream(data)
                    setDepositData(data)
                   }
                    vendContract.removeListener("Deposit",(payee,value,time,contractBalance,event))
                   
                   
                            })
                
                    vendContract.on("Withdraw", (time,amount,owner,event)=>{
                    let data = {
                    time: time.toString(), 
                    amount:amount.toString(),
                    owner:owner.toString(),
                    event:event
                    }
                  
                    if(datastream !== data){
                    setDataStream(data)
                    setWithdrawData(data)
                    }
                    
                    setProcessing(false)
                    vendContract.removeListener("Withdraw",(time,amount,owner,event))
                              })
                
            }
            return ()=>{mounted = false}
           
            
            }, [vendContract])
            
            const [recentDepositData, setRecentDepositData] = useState(null);
            const [recentWithdrawData, setRecentWithdrawData]= useState(null);


            useEffect(()=>{
            let mounted = true;
            if (depositdata){ 
            if(mounted && recentDepositData !== depositdata){ 
            console.log("about to set data")
            setRecentDepositData(depositdata)          
            console.log("UPDATAE IN DEPOSIT DATA")
            getContractBalance()
            }
        }
        return ()=> mounted = false
            },[depositdata])

            useEffect(()=>{
                if (withdrawdata){
                if(recentWithdrawData !== withdrawdata){  
                setRecentWithdrawData(withdrawdata)         
                console.log("UPDATAE IN WITHDRAW DATA")
                getContractBalance()
                }
            }
            },[withdrawdata])

 useEffect(()=>{
     console.log(tokenholder)
 },[tokenholder])


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


    useEffect(()=>{
   

    return ()=>window.location.reload(false);

    },[])



    useEffect(()=>{
console.log("TOKEN SELECTED")
    },[tokenselect])



 

  



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
                               

                                <TokenSelect
                                machineStatus = {machineStatus} 
                                tokenholder = {tokenholder}
                                tokenselect={tokenselect} 
                                tokensheld={tokensheld} 
                                defaultAccount={defaultAccount}
                                handleTokenSelect ={handleTokenSelect}
                                vendingcontract={vendingcontract}
                                handleTokenDisconnect = {handleTokenDisconnect}
                                />
                                
                                {tokenselect && tokenholder && vendingaddress ?
                                <>
                        
                                <Box sx={{marginTop:2}}>
                                <Typography variant="h2" sx={{ fontSize: 15, marginTop:2}}>Vending Machine Balance:{contractbalance}</Typography>
                                </Box>
                                 
                                
                                <WithdrawVendingBalanceButton/>
                                <Sell contractaddress={vendingaddress} />
                                <Box>
                                <HardwareConnect setMachineStatus={setMachineStatus} depositData={recentDepositData}/>
                                </Box>
                               
                                 
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