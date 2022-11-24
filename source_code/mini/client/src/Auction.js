import React, { Component } from "react";
import AuctionManager from "./contracts/AuctionManager.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';

class Auction extends Component {
  state = {
    storageValue: 9, web3: null, accounts: null, contract: null, bidAmount: 0, isRegistered: false, title: "",
    description: "",
    msp: "",t
    name: "sakthi"
  };
  componentDidMount = async () => {
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




      // const response = await contract.methods.isRegistered(accounts[0]).call();
      // if(response[0]==1){
      //   this.setState({isRegistered:true})
      // }



      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };




  createAuc = async () => {

    const { accounts, contract, title, description, msp } = this.state;

    console.log("hello", "creating")

    const auction = await contract.methods.createAuction(title, description, msp).send({ from: accounts[0] });


    const auctionList = await contract.methods.showAuctions().call();
    console.log(auctionList);
  }

  registerUser = async () => {
    const { accounts, contract } = this.state;

    const register = await contract.methods.createUser(this.state.name).send({ from: accounts[0] });


  }

  createBid = async () => {

    const { accounts, contract, bidAmount } = this.state;

    console.log("hello", "creating")

    const auction = await contract.methods.createBid(0, bidAmount).send({ from: accounts[0] });


    const AuctionAnalytics = await contract.methods.auctionAnalytics(0).call();
    console.log(AuctionAnalytics);
  }


  handleBidChange = (e) => {
    e.preventDefault();
    this.setState({ bidAmount: e.target.value });

  }


  runExample = async () => {
    const { accounts, contract } = this.state;

    console.log(contract)
    // Stores a given value, 5 by default.


    // Get the value from the contract to prove it worked.
    console.log(accounts)


    const n = await contract.methods.uId().call();
    console.log(n);
    // for (let i = 0; i < n; i++) {
    const a = await contract.methods.users(0).call()
    console.log("user id =0", a);

    const isRegistered_ = await contract.methods.isRegistered(accounts[0]).call();
    this.setState({ isRegistered: isRegistered_[0] == 1 })

    // }


    const response = await contract.methods.isRegistered(accounts[0]).call();
    console.log(response)

    this.registerUser();
    // console.log(auctionList);
    // Update state with the result.
    // this.setState({ storageValue: auctionList });

  };

  handleAuctionTitleChange = (event) => {
    this.setState({ title: event.target.value })
  }
  handleAuctionDescriptionChange = (event) => {
    this.setState({ description: event.target.value })
  }

  handleAuctionMspChange = (event) => {
    this.setState({ msp: event.target.value })
  }
  submitNewAuction = (event) => {
    event.preventDefault();
    this.createAuc();
  }

  registerNewUser = (event) => {
    event.preventDefault();
    this.registerUser()
  }
  handleAuctionNameChange = (event) => {
    this.setState({ name: event.target.value })

  }
  render() {


    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App jumbotron justify">
        <div ><span className={this.state.isRegistered ? "badge bg-success" : "badge bg-danger"}>{this.state.isRegistered ? `registered User ${this.state.accounts[0]}` : "non registered user please register"}</span></div>
        <h1>Welcome to Antiquetion</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully,
                </p>
        {!this.state.isRegistered &&
          <form onSubmit={this.registerNewUser} className="container-sm bg-light bg-gradient	w-25">
            <label>Enter name: </label><br /><input value={this.state.name} onChange={this.handleAuctionNameChange} className="form-control" /><br /><br />
            <input type="submit" value="Register User" className="btn btn-outline-primary" />
          </form>

        }

        <div>
          <form onSubmit={this.submitNewAuction} className="container-sm bg-light bg-gradient	">
            <h3>create Auction</h3>
            <label>Title: </label><br /><input value={this.state.title} onChange={this.handleAuctionTitleChange} className="form-control" /><br /><br />
            <label>Description: </label><br /><textarea rows="4" value={this.state.description} onChange={this.handleAuctionDescriptionChange} className="form-control" /><br /><br />
            <label>MSP: </label><br /><input value={this.state.msp} onChange={this.handleAuctionMspChange} className="form-control" /><br /><br />
            <input type="submit" value="Create Auction" className="btn btn-outline-primary" />
          </form>
        </div>


      </div>




    );
  }
}

export default Auction;
