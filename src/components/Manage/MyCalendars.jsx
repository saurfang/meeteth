import { Divider, Card } from "antd";
import { drizzleConnect } from "drizzle-react";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "emotion";
import PropTypes from "prop-types";
import equal from "fast-deep-equal";
import { pure } from "recompose";

import {
  memoizedTokenOfOwnerByIndex,
  unboxNumeric,
  getAllTokensByIndex,
} from "../helpers";

export const styles = {
  card: css({
    margin: 16,
  }),
  cardContainer: css({
    display: "flex",
  }),
};

export const CalendarCard = pure(({ tokenId }) => (
  <div className={styles.card}>
    <Card title={`Calendar ${tokenId || ""}`} loading={tokenId === null}>
      <Link to={`/meet/${tokenId}`}>
        /meet/
        {tokenId}
      </Link>
    </Card>
  </div>
));

class MyCalendars extends React.Component {
  static propTypes = {
    onCalendarListUpdate: PropTypes.func,
  };

  constructor(props, context) {
    super(props);

    this.dataKeys = {};

    this.state = {
      contracts: context.drizzle.contracts,
      calendarIds: [],
    };

    this.getCalendarOfOwnerKeys = memoizedTokenOfOwnerByIndex(
      context.drizzle.contracts.Calendar.methods.tokenOfOwnerByIndex
    );
  }

  componentDidMount() {
    this.resetAccount();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { accounts } = this.props;
    const account = accounts && accounts[0];

    if (!equal(accounts, prevProps.accounts)) {
      this.resetAccount();
    } else if (account) {
      this.dataKeys.tokenIds = this.getCalendarOfOwnerKeys(
        account,
        this.accountBalance()
      );
      this.updateCalendars();
    }
  }

  accountBalance() {
    const { contracts } = this.props;

    return unboxNumeric(contracts.Calendar.balanceOf[this.dataKeys.balance]);
  }

  resetAccount() {
    const { accounts } = this.props;
    const { contracts } = this.state;
    const account = accounts && accounts[0];
    if (account) {
      this.dataKeys = {
        balance: contracts.Calendar.methods.balanceOf.cacheCall(account),
      };
    }
  }

  updateCalendars() {
    const { contracts, onCalendarListUpdate } = this.props;
    const { calendarIds: currentCalendarIds } = this.state;

    const calendarIds = getAllTokensByIndex(
      this.dataKeys.tokenIds,
      contracts.Calendar.tokenOfOwnerByIndex
    );

    if (!equal(calendarIds, currentCalendarIds)) {
      if (onCalendarListUpdate) onCalendarListUpdate(calendarIds);

      this.setState({ calendarIds });
    }
  }

  render() {
    const { calendarIds } = this.state;

    const myCalendars = calendarIds.map((tokenId, i) => (
      <CalendarCard tokenId={tokenId} key={i} />
    ));
    const balance = this.accountBalance();

    return (
      <div>
        <Divider>My Calendars {balance > 0 && `(${balance})`}</Divider>
        <div className={styles.cardContainer}>{myCalendars}</div>
      </div>
    );
  }
}

MyCalendars.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = state => ({ ...state });

export default drizzleConnect(MyCalendars, mapStateToProps);