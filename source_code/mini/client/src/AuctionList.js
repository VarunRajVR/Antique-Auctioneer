import React, { Component, useContext } from "react";
import AuctionManager from "./contracts/AuctionManager.json";
import getWeb3 from "./getWeb3";
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';

// import {GlobalContext, GlobalProvider} from './GlobalContext';

class AuctionList extends Component {
  state = { storageValue: 9, web3: null, accounts: null, contract: null, bidAmount: 0, isRegistered: false, allAuctions: [], analytics: [] };
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

    const { accounts, contract } = this.state;

    console.log("hello", "creating")

    const auction = await contract.methods.createAuction("title", "description", 15).send({ from: accounts[0] });


    const auctionList = await contract.methods.showAuctions().call();
    console.log(auctionList);
  }

  registerUser = async () => {
    const { accounts, contract } = this.state;

    const register = await contract.methods.createUser("sakthi").send({ from: accounts[0] });
    console.log("register", register)
    console.log("hello", "set 1 ")


  }

  createBid = async (id) => {

    const { accounts, contract, bidAmount } = this.state;

    console.log("hello", bidAmount)

    const auction = await contract.methods.createBid(id, bidAmount).send({ from: accounts[0] });


    const totalAuction = await contract.methods.showAuctions().call()
    console.log(totalAuction);
    this.setState({ allAuctions: totalAuction });
    const analytics_ = await this.getAuctionAnalytics();

    this.setState({ analytics: analytics_ })

  }



  getAuctionAnalytics = async () => {
    const { contract } = this.state;

    let auctionAnalytics = [];
    for (let i = 0; i < this.state.allAuctions.length; i++) {
      const AuctionAnalytics = await contract.methods.auctionAnalytics(i).call();
      console.log(AuctionAnalytics);
      console.log(AuctionAnalytics.highestBid);
      auctionAnalytics.push(AuctionAnalytics);
    }
    return auctionAnalytics;
  }


  handleBidChange = (e) => {
    e.preventDefault();
    this.setState({ bidAmount: e.target.value });

  }


  runExample = async () => {
    const { accounts, contract, bidAmount } = this.state;
    const totalAuction = await contract.methods.showAuctions().call()
    console.log(totalAuction);
    this.setState({ allAuctions: totalAuction });
    console.log(this.state.allAuctions);

    this.state.allAuctions.map((auction, index) => {
      console.log("auc name:", auction.name)
    });

    const analytics_ = await this.getAuctionAnalytics();

    this.setState({ analytics: analytics_ })




  };

  submitNewBid = (event, id) => {
    event.preventDefault();
    this.createBid(id);
  }


  handleBidPriceChange = (event, id) => {
    this.setState({ bidAmount: event.target.value })
  }

  render() {

    let a = {
      a: "hello"
    }

    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App text-bg-light p-3">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <td>Auction ID</td>
              <td>Auction Details</td>
              <td>Minimum Price</td>
              <td>Bid</td>
            </tr>
          </thead>
          <tbody>
            {this.state.allAuctions?.map((auction, index) => {
              return (
                <tr key={index}>
                  <td>
                    {auction.auctionId}
                  </td>
                  <td>
                    <b>{auction.name}</b><br />
                    <font size="2">{auction.description}</font><br />
                    <Table>
                      <tr>
                        <td>Total Bids</td>
                        <td>Highest Bid</td>
                        <td>Latest Bid</td>
                        <td>Lowest Bid</td>
                      </tr>
                      <tr>
                        <td>{this.state.analytics[index]?.auctionBidId}</td>
                        <td>{this.state.analytics[index]?.highestBid}</td>
                        <td>{this.state.analytics[index]?.latestBid}</td>
                        <td>{this.state.analytics[index]?.auctionBidId == 0 ? 0 : this.state.analytics[index]?.lowestBid}</td>
                      </tr>
                    </Table>
                  </td>
                  <td>
                    ₹{auction.msp}
                  </td>
                  <td>
                    <form onSubmit={(event) => this.submitNewBid(event, auction.auctionId)} style={{ margin: "10px" }}>
                      <input required type="number" min={auction.msp} onChange={(event) => this.handleBidPriceChange(event, auction.auctionId)} placeholder="Enter your bid price" /><br /><br />
                      <input type="submit" value="Make Bid" className="btn btn-outline-primary" /><br /><br />
                    </form>
                  </td>
                </tr>)
            })}
          </tbody>
        </Table>

      </div>
    );
  }
}

export default AuctionList;
