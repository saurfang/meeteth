import { Divider, Button, Row, Col, Card } from "antd";
import { drizzleConnect } from "drizzle-react";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "emotion";
import PropTypes from "prop-types";
import arrayDiff from "arr-diff";

import {
  memoizedTokenOfOwnerByIndex,
  memoizedTokenByIndex,
  unboxNumeric,
  getAllTokensByIndex,
  drawIds,
  memoizedBlockie,
} from "../helpers";

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
  create: css({
    alignSelf: "center",
  }),
  card: css({
    margin: 16,
  }),
  cardContainer: css({
    display: "flex",
  }),
};

function CalendarCard({ tokenId }) {
  return (
    <div className={styles.card}>
      <Card title={`Calendar ${tokenId || ""}`} loading={tokenId === null}>
        <Link to={`/meet/${tokenId}`}>
          /meet/
          {tokenId}
        </Link>
      </Card>
    </div>
  );
}

class Manage extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      blockie: null,
      balance: null,
      contracts: context.drizzle.contracts,
      dataKeys: {},
      getCalendarOfOwnerKeys: memoizedTokenOfOwnerByIndex(
        context.drizzle.contracts.Calendar.methods.tokenOfOwnerByIndex
      ),
      getCalendarKeys: memoizedTokenByIndex(
        context.drizzle.contracts.Calendar.methods.tokenByIndex
      ),
    };
    this.createCalendar = this.createCalendar.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const derivedState = {};

    const account = props.accounts && props.accounts[0];

    if (account) {
      derivedState.blockie = memoizedBlockie(account);

      const { contracts, getCalendarOfOwnerKeys, getCalendarKeys } = state;
      if (contracts) {
        const dataKeys = {};
        derivedState.dataKeys = dataKeys;

        dataKeys.balance = contracts.Calendar.methods.balanceOf.cacheCall(
          account
        );
        derivedState.balance = unboxNumeric(
          props.contracts.Calendar.balanceOf[dataKeys.balance]
        );
        if (derivedState.balance) {
          dataKeys.tokenIds = getCalendarOfOwnerKeys(
            account,
            derivedState.balance
          );
        }

        dataKeys.totalSupply = contracts.Calendar.methods.totalSupply.cacheCall();
        derivedState.totalSupply = unboxNumeric(
          props.contracts.Calendar.totalSupply[dataKeys.totalSupply]
        );
        if (derivedState.totalSupply) {
          dataKeys.sampleTokenIds = getCalendarKeys(
            drawIds(derivedState.totalSupply - 1, 10, account)
          );
        }
      }
    }

    return derivedState;
  }

  createCalendar() {
    const { accounts } = this.props;
    const { contracts } = this.state;
    contracts.Calendar.methods.mint.cacheSend({ from: accounts[0] });
  }

  render() {
    const { accounts, contracts } = this.props;
    const { blockie, dataKeys } = this.state;

    const account = accounts[0];
    const myCalendarIds = getAllTokensByIndex(
      dataKeys.tokenIds,
      contracts.Calendar.tokenOfOwnerByIndex
    );
    const myCalendars = myCalendarIds.map((tokenId, i) => (
      <CalendarCard tokenId={tokenId} key={i} />
    ));
    const otherCalendars = arrayDiff(
      getAllTokensByIndex(
        dataKeys.sampleTokenIds,
        contracts.Calendar.tokenByIndex
      ),
      myCalendarIds
    ).map((tokenId, i) => <CalendarCard tokenId={tokenId} key={i} />);

    return (
      <div>
        <Row>
          <Col span={16} offset={4}>
            <div className={styles.container}>
              <div className={styles.account}>
                <div>
                  <img src={blockie} alt={account} />
                </div>
                <div>
                  <h4>{account}</h4>
                  <Link to={`/${account}`}>
                    meeteth.io/
                    {account}
                  </Link>
                </div>
              </div>
              <div className={styles.create}>
                <Button onClick={this.createCalendar}>
                  Create New Calendar
                </Button>
              </div>
            </div>
          </Col>
        </Row>
        <Divider>My Calendars</Divider>
        <div className={styles.cardContainer}>{myCalendars}</div>
        {otherCalendars.length > 0 && (
          <div>
            <Divider>Other Calendars</Divider>
            <div className={styles.cardContainer}>{otherCalendars}</div>
          </div>
        )}
      </div>
    );
  }
}

Manage.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = state => ({ ...state });

export default drizzleConnect(Manage, mapStateToProps);
