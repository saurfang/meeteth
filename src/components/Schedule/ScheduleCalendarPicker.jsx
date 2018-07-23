import { Divider, Button, Row, Col, Card, List } from "antd";
import { drizzleConnect } from "drizzle-react";
import makeBlockie from "ethereum-blockies-base64";
import React from "react";
import { Link } from "react-router-dom";
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
  card: css({
    fontSize: 16,
  }),
};

class ScheduleCalendarPicker extends React.PureComponent {
  constructor(props, context) {
    super(props);

    this.state = {
      blockie: null,
      contracts: context.drizzle.contracts,
      dataKeys: {},
    };
  }

  static getDerivedStateFromProps(props, state) {
    const derivedState = {};

    const {
      match: {
        params: { account },
      },
    } = props;

    derivedState.blockie = makeBlockie(account);

    const { contracts } = state;
    if (contracts) {
      derivedState.dataKeys = {
        ...derivedState.dataKeys,
        balance: contracts.Calendar.methods.balanceOf.cacheCall(account),
      };

      const balance =
        props.contracts.Calendar.balanceOf[derivedState.dataKeys.balance];
      if (balance && balance.value) {
        derivedState.dataKeys = {
          ...derivedState.dataKeys,
          tokenIds: Array.from(Array(+balance.value).keys()).map(i =>
            contracts.Calendar.methods.tokenOfOwnerByIndex.cacheCall(account, i)
          ),
        };
      }
    }

    return derivedState;
  }

  render() {
    const {
      contracts,
      match: {
        params: { account },
      },
    } = this.props;
    const { blockie, dataKeys } = this.state;

    const balance = contracts.Calendar.balanceOf[dataKeys.balance];
    const myCalendars =
      balance &&
      !Object.prototype.hasOwnProperty.call(balance, "error") &&
      Array.from(Array(+balance.value).keys()).map(i => {
        const tokenIdKey =
          dataKeys.tokenIds &&
          i < dataKeys.tokenIds.length &&
          dataKeys.tokenIds[i];
        const tokenId =
          tokenIdKey &&
          contracts.Calendar.tokenOfOwnerByIndex[tokenIdKey] &&
          contracts.Calendar.tokenOfOwnerByIndex[tokenIdKey].value;

        return {
          tokenId,
        };
      });

    return (
      <div>
        <Row>
          <Col span={16} offset={4}>
            <List
              itemLayout="horizontal"
              size="large"
              dataSource={myCalendars}
              header={
                <div className={styles.container}>
                  <div className={styles.account}>
                    <div>
                      <img src={blockie} alt={account} />
                    </div>
                    <div>
                      <h4>{account}</h4>
                      <span>
                        Please choose the calendar you would like to schedule
                        with.
                      </span>
                    </div>
                  </div>
                </div>
              }
              renderItem={({ tokenId }) => (
                <List.Item>
                  <div className={styles.card}>
                    <Link to={`/meet/${tokenId}`}>
                      Calendar {tokenId || ""}
                    </Link>
                  </div>
                </List.Item>
              )}
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
