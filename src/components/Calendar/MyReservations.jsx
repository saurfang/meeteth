import { Row, Col, Alert } from "antd";
import { drizzleConnect } from "drizzle-react";
import moment from "moment";
import React from "react";
import BigCalendar from "react-big-calendar";
import PropTypes from "prop-types";
import equal from "fast-deep-equal";
import chroma from "chroma-js";
import murmurhash from "murmurhash";
import { pure } from "recompose";
import { css } from "emotion";

import EventDetailsForm from "./EventDetailsForm";
import {
  memoizedTokenOfOwnerByIndex,
  unboxNumeric,
  getAllTokensByIndex,
} from "../helpers";

import "react-big-calendar/lib/css/react-big-calendar.css";

const styles = {
  alert: css({
    margin: "15px 0",
  }),
};

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const LazyBigCalendar = pure(BigCalendar);
class MyReservations extends React.Component {
  static eventStyleGetter(event, isSelected) {
    const colors = chroma.brewer.Set3;
    const hashedColor =
      colors[Math.abs(murmurhash.v3(event.owner)) % colors.length];
    const backgroundColor = isSelected
      ? chroma(hashedColor)
          .darken()
          .saturate()
          .hex()
      : hashedColor;
    const color =
      chroma.contrast(backgroundColor, "white") > 4.5 ? "white" : "black";
    const style = {
      backgroundColor,
      color,
    };
    return {
      style,
    };
  }

  static propTypes = {
    account: PropTypes.string,
  };

  constructor(props, context) {
    super(props);

    this.state = {
      reservations: [],
      events: [],
      defaultDate: new Date(),
      selectedEvent: null,
      contracts: context.drizzle.contracts,
    };
    this.dataKeys = {};

    this.getReservationKeys = memoizedTokenOfOwnerByIndex(
      context.drizzle.contracts.Calendar.methods.reservationOfOwnerByIndex
    );

    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onEventSubmit = this.onEventSubmit.bind(this);
  }

  componentDidMount() {
    this.componentDidUpdate({});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { account: prevAccount } = prevProps;
    const { contracts, account } = this.props;

    if (prevAccount !== account) {
      this.resetAccount();
    }

    const balance = unboxNumeric(
      contracts.Reservation.balanceOf[this.dataKeys.balance]
    );
    if (balance) {
      // NB: limit number of events to prevent browser performance issue
      // TODO: add pagination and only fetch viewable events based on calendar time range
      const EVENTS_LIMIT = 100;
      if (balance > EVENTS_LIMIT) {
        this.balanceOverLimit = true;
      }
      this.dataKeys.reservationKeys = this.getReservationKeys(
        account,
        Math.min(balance, EVENTS_LIMIT)
      );
      this.updateEvents();
    }
  }

  onSelectEvent(event) {
    const { selectedEvent } = this.state;
    if (selectedEvent === null || selectedEvent.id !== event.id) {
      this.setState({
        selectedEvent: event,
      });
    }
  }

  onEventSubmit(err, values) {
    if (!err) {
      const { account } = this.props;
      const {
        drizzle: { contracts },
      } = this.context;

      contracts.Calendar.methods.reserve.cacheSend(
        account,
        moment(values.timeRange[0])
          .utc()
          .valueOf(),
        moment(values.timeRange[1])
          .utc()
          .valueOf(),
        { from: account }
      );
    }
  }

  resetAccount() {
    const { account } = this.props;
    const { contracts } = this.state;
    if (account) {
      this.dataKeys = {
        balance: contracts.Reservation.methods.balanceOf.cacheCall(account),
      };
      this.updateEvents();
    }
  }

  updateEvents() {
    const { contracts, account } = this.props;
    const { reservations: currentReservations } = this.state;

    const reservations = getAllTokensByIndex(
      this.dataKeys.reservationKeys,
      contracts.Calendar.reservationOfOwnerByIndex
    ).filter(x => x);

    if (reservations && !equal(currentReservations, reservations)) {
      const events = reservations.map(
        ({ reservationId, startTime, stopTime, calendarId }) => ({
          id: +reservationId,
          calendarId: +calendarId,
          title: `Reserved in Calendar ${calendarId}`,
          owner: account,
          start: moment(+startTime).toDate(),
          end: moment(+stopTime).toDate(),
        })
      );
      const defaultDate = events.reduce(
        (acc, { start }) => (start < acc ? start : acc),
        new Date()
      );
      this.setState({
        defaultDate,
        reservations,
        events,
      });
    }
  }

  render() {
    const { events, selectedEvent, defaultDate } = this.state;

    return (
      <div>
        {events.length === 0 && (
          <div className={styles.alert}>
            <Alert message="You don't have any reservations yet." />
          </div>
        )}
        {events.length > 0 && (
          <Row gutter={16}>
            <Col span={16}>
              {this.balanceOverLimit && (
                <div className={styles.alert}>
                  <Alert
                    message="Calendar contains too many events! Only fetching first 100."
                    type="warning"
                    showIcon
                  />
                </div>
              )}
              <LazyBigCalendar
                selectable
                events={events}
                selected={selectedEvent}
                defaultView="agenda"
                defaultDate={defaultDate}
                onSelectEvent={this.onSelectEvent}
                eventPropGetter={MyReservations.eventStyleGetter}
              />
            </Col>
            <Col span={8}>
              {selectedEvent && (
                <EventDetailsForm
                  isUpdating={false}
                  event={selectedEvent}
                  onFormSubmit={this.onEventSubmit}
                />
              )}
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

MyReservations.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = ({ accounts, contracts }) => ({
  account: accounts && accounts[0],
  contracts,
});

export default drizzleConnect(MyReservations, mapStateToProps);
