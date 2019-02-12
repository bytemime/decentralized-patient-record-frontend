import React, { Component } from "react";
import web3 from "./web3";
import ipfs from "./ipfs";
import filestore from "./filestore";
import { Button, ProgressBar, Callout, Intent } from "@blueprintjs/core";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";
class App extends Component {
  state = {
    buffer: null,
    ipfsHash: null,
    uploading: false,
    sendingTransaction: false,
    loading: false,
    err: false,
    successful: false,
    IPFS_HASH: null
  };
  async componentDidMount() {
    let accounts = await web3.eth.getAccounts();
    console.log(accounts);
  }
  handleFiles = e => {
    e.stopPropagation();
    e.preventDefault();
    console.log(e.target.files[0]);
    let file = e.target.files[0];
    let r = new window.FileReader();
    r.readAsArrayBuffer(file);
    r.onloadend = () => this.convertToBuffer(r);
  };
  convertToBuffer = async r => {
    const buffer = await Buffer.from(r.result);
    this.setState({ buffer });
    console.log(buffer);
  };
  handleSubmit = async e => {
    e.preventDefault();
    this.setState(state => ({
      uploading: !state.uploading,
      loading: !state.loading
    }));
    ipfs
      .add(this.state.buffer)
      .then(async res => {
        console.log(res[0].hash);
        this.setState(state => ({
          uploading: !state.uploading,
          sendingTransaction: !state.sendingTransaction
        }));
        const accounts = await web3.eth.getAccounts();
        let resp;
        try {
          resp = await filestore.methods
            .setHash(res[0].hash)
            .send({ from: accounts[0] });
        } catch (err) {
          console.log("error from try catch", err);
          this.setState(state => ({
            sendingTransaction: !state.sendingTransaction,
            loading: !state.loading,
            err: !state.err
          }));
        }
        if (resp) {
          this.setState(state => ({
            sendingTransaction: !state.sendingTransaction,
            loading: !state.loading,
            successful: !state.successful
          }));
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  handleGetHash = async () => {
    const accounts = await web3.eth.getAccounts();
    let resp = await filestore.methods.getHash().call({ from: accounts[0] });
    this.setState({ IPFS_HASH: resp });
    // console.log("file hash", resp);
  };
  render() {
    return (
      <div>
        <Navbar />
        <div className="container">
          {this.state.err && (
            <Callout intent="danger">An error occured</Callout>
          )}
          {this.state.successful && (
            <Callout intent="success">Operation completed successfully</Callout>
          )}
          <form>
            <h1>Upload file to ipfs</h1>
            <input type="file" name="file upload" onChange={this.handleFiles} />
            <Button text="Submit" onClick={this.handleSubmit} />
            {this.state.uploading && <p>uploading...</p>}
            {this.state.sendingTransaction && <p>sending transaction...</p>}
            {this.state.loading && <ProgressBar />}
          </form>
          <h1>get IPFS hash of the uploaded file</h1>
          <button onClick={this.handleGetHash}>get ipfs file hash</button>
          <h2>{this.state.IPFS_HASH}</h2>
          {this.state.IPFS_HASH && (
            <div>
              <h4 style={{ color: "green" }}>your file is available at</h4>
              <div>
                <a
                  href={`https://gateway.ipfs.io/ipfs/${this.state.IPFS_HASH}`}
                  target="_blank"
                >
                  download file
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default App;
