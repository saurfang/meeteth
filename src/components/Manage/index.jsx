import { Divider, Button, Row, Col, Card } from "antd";
import { drizzleConnect } from "drizzle-react";
import makeBlockie from "ethereum-blockies-base64";
import React from "react";
import { css } from "emotion";
import PropTypes from "prop-types";

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

class Manage extends React.Component {
  constructor(props, context) {
    super(props);

    this.state = {
      blockie: null,
      contracts: context.drizzle.contracts,
      dataKeys: {},
    };
    this.createCalendar = this.createCalendar.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const derivedState = {};

    const account = props.accounts && props.accounts[0];

    if (account) {
      derivedState.blockie = makeBlockie(account);

      const { contracts } = state;
      if (contracts) {
        derivedState.dataKeys = {
          balance: contracts.Calendar.methods.balanceOf.cacheCall(account),
        };
      }
    }

    return derivedState;
  }

  createCalendar() {
    const { contracts } = this.state;
    contracts.Calendar.methods.mint.cacheSend();
  }

  render() {
    const { accounts, contracts } = this.props;
    const { blockie, dataKeys } = this.state;

    const account = accounts[0];
    const balance = contracts.Calendar.balanceOf[dataKeys.balance];
    const myCalendars =
      balance &&
      Array.from(Array(+balance.value).keys()).map(i => {
        return (
          <div className={styles.card} key={i}>
            <Card title={`Calendar ${i}`}>Calendar {i}</Card>
          </div>
        );
      });

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
                  <a>meeteth.io/meet/{account}</a>
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
        <Divider>Other Calendars</Divider>
      </div>
    );
  }
}

Manage.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = state => ({ ...state });

export default drizzleConnect(Manage, mapStateToProps);
