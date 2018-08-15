import { Divider, Row, Col } from "antd";
import React from "react";
import { Link } from "react-router-dom";

import MyCalendars from "../Manage/MyCalendars";
import AccountHeader from "./AccountHeader";

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
        <Divider>My Reservations</Divider>
        <MyCalendars onCalendarListUpdate={this.updateMyCalendars} />
        {hasCalendar === false && <Link to="/manage">Create new calendar</Link>}
      </div>
    );
  }
}
