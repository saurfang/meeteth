import { Divider, Button } from "antd";
import { drizzleConnect } from "drizzle-react";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "emotion";
import PropTypes from "prop-types";
import arrayDiff from "arr-diff";

import MyCalendars, { styles as cardStyles, CalendarCard } from "./MyCalendars";
import {
  memoizedTokenByIndex,
  unboxNumeric,
  getAllTokensByIndex,
  drawIds,
} from "../helpers";
import AccountHeader from "../Dashboard/AccountHeader";

const styles = {
  ...cardStyles,
  container: css({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  }),
  create: css({
    alignSelf: "center",
    margin: "0 16px",
  }),
};

class Manage extends React.Component {
  static propTypes = {
    account: PropTypes.string,
  };

  constructor(props, context) {
    super(props);

    this.state = {
      myCalendarIds: [],
      contracts: context.drizzle.contracts,
    };
    this.dataKeys = {};

    this.getCalendarKeys = memoizedTokenByIndex(
      context.drizzle.contracts.Calendar.methods.tokenByIndex
    );

    this.createCalendar = this.createCalendar.bind(this);
    this.updateMyCalendars = this.updateMyCalendars.bind(this);
  }

  componentDidMount() {
    this.componentDidUpdate({});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { account: prevAccount } = prevProps;
    const { account, contracts } = this.props;

    if (account !== prevAccount) {
      this.resetAccount();
    }

    if (account) {
      const totalSupply = unboxNumeric(
        contracts.Calendar.totalSupply[this.dataKeys.totalSupply]
      );
      this.dataKeys.sampleTokenIds = this.getCalendarKeys(
        drawIds(totalSupply - 1, 10, account)
      );
    }
  }

  resetAccount() {
    const { contracts } = this.state;
    this.dataKeys = {
      totalSupply: contracts.Calendar.methods.totalSupply.cacheCall(),
    };
  }

  createCalendar() {
    const { account } = this.props;
    const { contracts } = this.state;
    contracts.Calendar.methods.mint.cacheSend({ from: account });
  }

  updateMyCalendars(myCalendarIds) {
    this.setState({
      myCalendarIds,
    });
  }

  render() {
    const { account, contracts } = this.props;
    const { myCalendarIds } = this.state;

    const otherCalendars = arrayDiff(
      getAllTokensByIndex(
        this.dataKeys.sampleTokenIds,
        contracts.Calendar.tokenByIndex
      ),
      myCalendarIds
    ).map((tokenId, i) => <CalendarCard tokenId={tokenId} key={i} />);

    return (
      <div>
        <div className={styles.container}>
          <AccountHeader>
            <Link to={`/${account}`}>
              meeteth.io/
              {account}
            </Link>
          </AccountHeader>
          <div className={styles.create}>
            <Button onClick={this.createCalendar}>Create New Calendar</Button>
          </div>
        </div>
        <MyCalendars onCalendarListUpdate={this.updateMyCalendars} />
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

const mapStateToProps = ({ accounts, contracts }) => ({
  contracts,
  account: accounts && accounts[0],
});

export default drizzleConnect(Manage, mapStateToProps);
