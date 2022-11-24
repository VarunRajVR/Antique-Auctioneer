import React, { useEffect, createContext, useState } from "react";
import AuctionManager from "./contracts/AuctionManager.json";


import getWeb3 from "./getWeb3";

const GlobalContext = createContext({
  web3: null,
  contract: null,
  accounts: [],
});

const GlobalProvider = ({ children }) => {
  const [web3state, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);
//   const [auctionToken, setAuctionToken] = useState(null);

  useEffect(() => {
    async function callWeb3() {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
      
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
      
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = AuctionManager.networks[networkId];
      
      
      
            const instance = new web3.eth.Contract(
              AuctionManager.abi,
              deployedNetwork && deployedNetwork.address,
            );
            instance.options.address = "0x5731e62Fba66cDC40d84FEdab49f18A6d44c24Bf";
            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
      
      
      
      
            const response = await contract.methods.isRegistered(accounts[0]).call();
            if(response[0]==1){
              this.setState({isRegistered:true})
            }
      
      
            setWeb3(web3)
            setAccounts(accounts)
            setContract(instance);
            console.log("created",web3,accounts,instance)
            // this.setState({ web3, accounts,  contract: instance });
          } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
              `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
          }
        }
    callWeb3();
  }, []);

  return (
    <GlobalContext.Provider
      value={{ web3state,contract, account: accounts[0], }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export { GlobalContext, GlobalProvider };
