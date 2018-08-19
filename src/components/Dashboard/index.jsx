import { Row, Col } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { css } from "emotion";

import MyCalendars from "../Manage/MyCalendars";
import AccountHeader from "./AccountHeader";
import MyReservations from "../Calendar/MyReservations";

const styles = {
  container: css({
    display: "flex",
    flex: "1",
    alignItems: "center",
    justifyContent: "center",
  }),
};

export default class Dashboard extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { hasCalendar: null };

    this.updateMyCalendars = this.updateMyCalendars.bind(this);
  }

  updateMyCalendars(myCalendarIds) {
    this.setState({
      hasCalendar: myCalendarIds.length > 0,
    });
  }

  render() {
    const { hasCalendar } = this.state;

    return (
      <div>
        <Row>
          <Col span={16} offset={4}>
            <AccountHeader />
          </Col>
        </Row>

        <MyReservations />

        <MyCalendars onCalendarListUpdate={this.updateMyCalendars} />
        {hasCalendar === false && (
          <div className={styles.container}>
            <Link to="/calendars">Create new calendar</Link>
          </div>
        )}
      </div>
    );
  }
}
