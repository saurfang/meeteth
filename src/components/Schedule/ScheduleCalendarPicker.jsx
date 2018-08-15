import { Row, Col, List } from "antd";
import { drizzleConnect } from "drizzle-react";
import makeBlockie from "ethereum-blockies-base64";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "emotion";
import PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import { pure } from "recompose";
import {
  unboxNumeric,
  memoizedTokenOfOwnerByIndex,
  getAllTokensByIndex,
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
  card: css({
    fontSize: 16,
  }),
};

const AccountHeader = pure(({ account, hasData }) => (
  <div className={styles.container}>
    <div className={styles.account}>
      <div>
        <img src={makeBlockie(account)} alt={account} />
      </div>
      <div>
        <h4>{account}</h4>
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
  };

  constructor(props, context) {
    super(props);

    this.dataKeys = {};

    this.state = {
      contracts: context.drizzle.contracts,
    };

    this.getCalendarOfOwnerKeys = memoizedTokenOfOwnerByIndex(
      context.drizzle.contracts.Calendar.methods.tokenOfOwnerByIndex
    );
  }

  componentDidMount() {
    const {
      match: {
        params: { account },
      },
    } = this.props;

    const { contracts } = this.state;
    this.dataKeys.balance = contracts.Calendar.methods.balanceOf.cacheCall(
      account
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      match: {
        params: { account },
      },
      contracts,
    } = this.props;

    const balance = unboxNumeric(
      contracts.Calendar.balanceOf[this.dataKeys.balance]
    );

    if (balance) {
      this.dataKeys.tokenIds = this.getCalendarOfOwnerKeys(account, balance);
    }
  }

  render() {
    const {
      contracts,
      match: {
        params: { account },
      },
    } = this.props;

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
                  account={account}
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
