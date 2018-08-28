import { Alert, Spin } from "antd";
import { drizzleConnect } from "drizzle-react";
import React, { Children, Component } from "react";
import PropTypes from "prop-types";

/*
 * Create component.
 */

class LoadingContainer extends Component {
  static propTypes = {
    error: PropTypes.node,
    loading: PropTypes.node,
    children: PropTypes.node,
    web3: PropTypes.object,
    accounts: PropTypes.object,
    drizzleStatus: PropTypes.object,
  };

  render() {
    const {
      error,
      loading,
      children,
      web3,
      accounts,
      drizzleStatus,
    } = this.props;

    if (web3.status === "failed") {
      if (error) {
        return error;
      }

      return (
        <Alert
          message="This browser has no connection to the Ethereum network."
          description="Please use the Chrome/FireFox extension MetaMask, Brave browser or dedicated Ethereum browsers Mist or Parity."
          type="error"
          iconType="disconnect"
          showIcon
        />
      );
    }

    if (web3.status === "initialized" && Object.keys(accounts).length === 0) {
      return (
        <Alert
          message="We cannot find any Ethereum accounts!"
          description={
            <span>
              Please check and make sure Metamask or your browser are pointed at
              the correct network (<b>Rinkeby or Local Development</b>) and your
              account is unlocked.
            </span>
          }
          type="error"
          iconType="wallet"
          showIcon
        />
      );
    }

    if (drizzleStatus.initialized) {
      return Children.only(children);
    }

    if (loading) {
      return loading;
    }

    return (
      <Spin tip="Loading dapp...">
        <Alert
          message="Welcome to MeetETH"
          description="Decentralized Tokenized Access awaits."
          type="info"
        />
      </Spin>
    );
  }
}

LoadingContainer.contextTypes = {
  drizzle: PropTypes.object,
};

/*
 * Export connected component.
 */

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
  web3: state.web3,
});

export default drizzleConnect(LoadingContainer, mapStateToProps);
