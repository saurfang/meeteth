import { Divider } from "antd";
import makeBlockie from "ethereum-blockies-base64";
import React from "react";
import { callContract, getContract } from "vort_x";
import {
  connect,
  VortexContractsList,
  VortexMethodCallList,
} from "vort_x-components";
import { VortexContractProps } from "vortex";

import "./index.scss";

class ContractCallReturnContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <p>Current value {this.props.result}</p>
      </div>
    );
  }
}

class ContractsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.props.contract.instance.vortexMethods.get.data({
      from: this.props.web3.coinbase,
    });

    const mapStateToProps = state => {
      return {
        result: callContract(
          getContract(
            state,
            this.props.contract_name,
            this.props.contract_address
          ),
          "get",
          { from: this.props.web3.coinbase }
        ),
        update: newValue => {
          this.props.contract.instance.vortexMethods.set.send(newValue, {
            from: this.props.web3.coinbase,
            gas: 20000000,
          });
        },
      };
    };

    this.resultContainer = connect(
      ContractCallReturnContainer,
      mapStateToProps
    );
  }

  render() {
    if (this.props.contract) {
      return (
        <>
          <this.resultContainer />
        </>
      );
    } else {
      return <></>;
    }
  }
}

export default class Manage extends React.Component {
  render() {
    return (
      <>
        <VortexContractsList
          element={ContractsContainer}
          contract_name="Calendar"
        />
      </>
    );
  }
}
