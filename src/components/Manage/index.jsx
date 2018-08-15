import { Divider, Button, Row, Col, Card } from "antd";
import { drizzleConnect } from "drizzle-react";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "emotion";
import PropTypes from "prop-types";
import arrayDiff from "arr-diff";
import equal from "fast-deep-equal";
import { pure } from "recompose";
import makeBlockie from "ethereum-blockies-base64";

import {
  memoizedTokenOfOwnerByIndex,
  memoizedTokenByIndex,
  unboxNumeric,
  getAllTokensByIndex,
  drawIds,
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

const CalendarCard = pure(({ tokenId }) => (
  <div className={styles.card}>
    <Card title={`Calendar ${tokenId || ""}`} loading={tokenId === null}>
      <Link to={`/meet/${tokenId}`}>
        /meet/
        {tokenId}
      </Link>
    </Card>
  </div>
));

const AccountHeader = pure(({ account }) => (
  <div className={styles.account}>
    <div>
      <img src={makeBlockie(account)} alt={account} />
    </div>
    <div>
      <h4>{account}</h4>
      <Link to={`/${account}`}>
        meeteth.io/
        {account}
      </Link>
    </div>
  </div>
));

class Manage extends React.Component {
  constructor(props, context) {
    super(props);

    this.dataKeys = {};

    this.state = {
      contracts: context.drizzle.contracts,
    };
    this.getCalendarOfOwnerKeys = memoizedTokenOfOwnerByIndex(
      context.drizzle.contracts.Calendar.methods.tokenOfOwnerByIndex
    );
    this.getCalendarKeys = memoizedTokenByIndex(
      context.drizzle.contracts.Calendar.methods.tokenByIndex
    );
    this.createCalendar = this.createCalendar.bind(this);
  }

  componentDidMount() {
    this.resetAccount();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { accounts, contracts } = this.props;
    const account = accounts && accounts[0];

    if (!equal(accounts, prevProps.accounts)) {
      this.resetAccount();
    } else if (account) {
      const balance = unboxNumeric(
        contracts.Calendar.balanceOf[this.dataKeys.balance]
      );
      if (balance) {
        this.dataKeys.tokenIds = this.getCalendarOfOwnerKeys(account, balance);
      }

      const totalSupply = unboxNumeric(
        contracts.Calendar.totalSupply[this.dataKeys.totalSupply]
      );
      if (totalSupply) {
        this.dataKeys.sampleTokenIds = this.getCalendarKeys(
          drawIds(totalSupply - 1, 10, account)
        );
      }
    }
  }

  resetAccount() {
    const { accounts } = this.props;
    const { contracts } = this.state;
    const account = accounts && accounts[0];
    if (account) {
      this.dataKeys = {
        balance: contracts.Calendar.methods.balanceOf.cacheCall(account),
        totalSupply: contracts.Calendar.methods.totalSupply.cacheCall(),
      };
    }
  }

  createCalendar() {
    const { accounts } = this.props;
    const { contracts } = this.state;
    contracts.Calendar.methods.mint.cacheSend({ from: accounts[0] });
  }

  render() {
    const { accounts, contracts } = this.props;

    const account = accounts[0];
    const myCalendarIds = getAllTokensByIndex(
      this.dataKeys.tokenIds,
      contracts.Calendar.tokenOfOwnerByIndex
    );
    const myCalendars = myCalendarIds.map((tokenId, i) => (
      <CalendarCard tokenId={tokenId} key={i} />
    ));
    const otherCalendars = arrayDiff(
      getAllTokensByIndex(
        this.dataKeys.sampleTokenIds,
        contracts.Calendar.tokenByIndex
      ),
      myCalendarIds
    ).map((tokenId, i) => <CalendarCard tokenId={tokenId} key={i} />);

    return (
      <div>
        <Row>
          <Col span={16} offset={4}>
            <div className={styles.container}>
              <AccountHeader account={account} />
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
