import { Col, List, Row } from "antd";
import { drizzleConnect } from "drizzle-react";
import { css } from "emotion";
import makeBlockie from "ethereum-blockies-base64";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import ReactRouterPropTypes from "react-router-prop-types";
import { pure } from "recompose";
import ENS from "ethereum-ens";
import { Redirect } from "react-router";
import TruffleContract from "truffle-contract";
import {
  getAllTokensByIndex,
  memoizedTokenOfOwnerByIndex,
  unboxNumeric,
} from "../helpers";

import ENSRegistry from "../../contracts/ENSRegistry.json";

const styles = {
  container: css({
    display: "flex",
  }),
  account: css({
    flex: "1",
    display: "flex",
    "& div": {
      margin: 8,
    },
    "& img": {
      width: 64,
      height: 64,
    },
  }),
  card: css({
    fontSize: 16,
  }),
};

const AccountHeader = pure(({ address, alias, hasData }) => (
  <div className={styles.container}>
    <div className={styles.account}>
      <div>{address && <img src={makeBlockie(address)} alt={address} />}</div>
      <div>
        <h4>{alias || address}</h4>
        {alias && <h5>{address}</h5>}
        {hasData && (
          <span>
            Please choose the calendar you would like to schedule with.
          </span>
        )}
      </div>
    </div>
  </div>
));

const CalendarLink = pure(({ tokenId }) => (
  <List.Item>
    <div className={styles.card}>
      <Link to={`/meet/${tokenId}`}>Calendar {tokenId || ""}</Link>
    </div>
  </List.Item>
));

class ScheduleCalendarPicker extends React.PureComponent {
  static propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
    contracts: PropTypes.object,
  };

  constructor(props, context) {
    super(props);

    this.dataKeys = {};

    this.state = {
      contracts: context.drizzle.contracts,
      account: null,
      alias: null,
      accountError: null,
      ens: null,
    };

    context.drizzle.web3.eth.net.getId().then(id => {
      if (id > 4) {
        const ENSContract = TruffleContract(ENSRegistry);
        ENSContract.setProvider(context.drizzle.web3.currentProvider);
        ENSContract.setNetwork(id);
        this.setState({
          ens: new ENS(context.drizzle.web3, ENSContract.address),
        });
      } else {
        this.setState({
          ens: new ENS(context.drizzle.web3),
        });
      }
    });
    this.isEthAddress = context.drizzle.web3.utils.isAddress;

    this.getCalendarOfOwnerKeys = memoizedTokenOfOwnerByIndex(
      context.drizzle.contracts.Calendar.methods.tokenOfOwnerByIndex
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { contracts } = this.props;
    const { account, ens } = this.state;

    if (ens !== prevState.ens) {
      this.setAccount();
    } else if (account) {
      const balance = unboxNumeric(
        contracts.Calendar.balanceOf[this.dataKeys.balance]
      );

      this.dataKeys.tokenIds = this.getCalendarOfOwnerKeys(account, balance);
    }
  }

  setAccount() {
    const {
      match: {
        params: { account },
      },
    } = this.props;
    const { contracts, ens } = this.state;

    if (this.isEthAddress(account)) {
      this.dataKeys.balance = contracts.Calendar.methods.balanceOf.cacheCall(
        account
      );

      ens
        .reverse(account)
        .name()
        .then(
          name => {
            this.setState({ account, alias: name });
          },
          err => {
            this.setState({ account });
          }
        );
    } else {
      ens
        .resolver(account)
        .addr()
        .then(
          addr => {
            this.dataKeys.balance = contracts.Calendar.methods.balanceOf.cacheCall(
              addr
            );

            this.setState({ account: addr, alias: account });
          },
          accountError => {
            this.setState({ alias: account, accountError });
          }
        );
    }
  }

  render() {
    const { contracts } = this.props;
    const { account, alias, accountError } = this.state;

    if (accountError) {
      return <Redirect to="/" />;
    }

    const calendars = getAllTokensByIndex(
      this.dataKeys.tokenIds,
      contracts.Calendar.tokenOfOwnerByIndex
    ).map(tokenId => ({
      tokenId,
    }));

    return (
      <div>
        <Row>
          <Col span={16} offset={4}>
            <List
              itemLayout="horizontal"
              size="large"
              dataSource={calendars}
              header={
                <AccountHeader
                  address={account}
                  alias={alias}
                  hasData={calendars.length > 0}
                />
              }
              renderItem={({ tokenId }) => <CalendarLink tokenId={tokenId} />}
              locale={{ emptyText: "No Calendars Found" }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

ScheduleCalendarPicker.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = state => ({ ...state });

export default drizzleConnect(ScheduleCalendarPicker, mapStateToProps);
