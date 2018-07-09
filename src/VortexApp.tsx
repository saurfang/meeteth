import { Alert, Spin } from "antd";
import React, { Component } from "react";
import {
  VortexGate,
  VortexMetamaskLoader,
  VortexWeb3Loaded,
  VortexWeb3LoadError,
  VortexWeb3Loading,
  VortexWeb3Locked,
  VortexWeb3NetworkError,
} from "vort_x-components";
import Web3 from "web3";
import CalendarContract from "./contracts/Calendar.json";
import ReservationContract from "./contracts/Reservation.json";

class App extends Component {
  public render() {
    return (
      <VortexGate
        contracts={{
          network_contracts: [CalendarContract, ReservationContract],
          preloaded_contracts: ["Calendar", "Reservation"],
          truffle_contracts: [CalendarContract, ReservationContract],
          type: "truffle",
        }}
        loader={VortexMetamaskLoader(Web3)}
        ipfs_config={{
          host: "ipfs.infura.io",
          options: {
            protocol: "https",
          },
          port: "5001",
        }}
        backlink_config={{
          url: {
            default: "ws://localhost:8545/ws",
            mainnet: "wss://mainnet.infura.io/ws",
          },
        }}
      >
        <VortexWeb3Loaded>{this.props.children}</VortexWeb3Loaded>

        <VortexWeb3Loading>
          <Spin tip="Loading..." />
        </VortexWeb3Loading>

        <VortexWeb3LoadError>
          <Alert
            message="Web3 Not Found"
            description="Looks like there is a problem with your Web3. Check that you
            are using a browser with web3 support (e.g. a browser with Metamask, Mist)
            and have unlocked your account. Make sure Web3 is properly connected to a
            network and your loader resolves a web3@1.0.0+ version of Web3!"
            type="error"
            showIcon={true}
          />
        </VortexWeb3LoadError>

        <VortexWeb3NetworkError>
          <Alert
            message="Wrong Network"
            description="We could not find the smart contracts on the current
            network. Please check if you are on the Rinkeby network!"
            type="error"
            showIcon={true}
          />
        </VortexWeb3NetworkError>

        <VortexWeb3Locked>
          <Alert
            message="Web3 Locked"
            description="Please unlock your wallet provider, e.g. Metamask"
            type="error"
            showIcon={true}
          />
        </VortexWeb3Locked>
      </VortexGate>
    );
  }
}

export default App;
