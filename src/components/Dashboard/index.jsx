import { Divider } from "antd";
import moment from "moment";
import React from "react";

export default class Dashboard extends React.Component {
  render() {
    return (
      <div>
        <Divider>My Reservations</Divider>
        <Divider>My Calendars</Divider>
      </div>
    );
  }
}
