import { Row, Col } from "antd";
import { drizzleConnect } from "drizzle-react";
import moment from "moment";
import React from "react";
import BigCalendar from "react-big-calendar";
import ReactRouterPropTypes from "react-router-prop-types";
import PropTypes from "prop-types";
import equal from "fast-deep-equal";
import chroma from "chroma-js";
import murmurhash from "murmurhash";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { pure } from "recompose";
import memoize from "fast-memoize";

import EventDetailsForm from "./EventDetailsForm";
import {
  memoizedTokenOfOwnerByIndex,
  unbox,
  unboxNumeric,
  getAllTokensByIndex,
} from "../helpers";

import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

const LazyBigCalendar = pure(BigCalendar);
class Schedule extends React.Component {
  static eventStyleGetter(event, start, end, isSelected) {
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
      // borderRadius: "0px",
      // opacity: 0.8,
      color,
      // border: "1px",
      // display: "block",
    };
    return {
      style,
    };
  }

  static propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
  };

  constructor(props, context) {
    super(props);

    this.state = {
      reservations: [],
      events: [],
      newEvent: null,
      selectedEvent: null,
      contracts: context.drizzle.contracts,
    };
    this.today = new Date();
    this.dataKeys = {};

    this.getReservationKeys = memoizedTokenOfOwnerByIndex(
      context.drizzle.contracts.Calendar.methods.reservationOfCalendarByIndex
    );
    this.getEvents = memoize((events, newEvent) => [...events, newEvent]);

    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.onEventSubmit = this.onEventSubmit.bind(this);
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { contracts } = this.state;

    this.dataKeys.existsKey = contracts.Calendar.methods.exists.cacheCall(id);
    this.dataKeys.ownerKey = contracts.Calendar.methods.ownerOf.cacheCall(id);
    this.dataKeys.balanceKey = contracts.Calendar.methods.reservationBalanceOf.cacheCall(
      id
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      match: {
        params: { id },
      },
      contracts,
    } = this.props;

    const balance = unboxNumeric(
      contracts.Calendar.reservationBalanceOf[this.dataKeys.balanceKey]
    );
    if (balance) {
      this.dataKeys.reservationKeys = this.getReservationKeys(id, balance);
      this.updateEvents();
    }
  }

  onSelectEvent(event) {
    const { selectedEvent } = this.state;
    if (selectedEvent === null || selectedEvent.id !== event.id) {
      this.setState({
        newEvent: null,
        selectedEvent: event,
      });
    }
  }

  onSelectSlot(slotInfo) {
    const { accounts } = this.props;
    const { newEvent } = this.state;
    const event = {
      id: -1,
      title: newEvent && newEvent.title,
      owner: accounts[0],
      ...slotInfo,
    };
    this.setState({
      newEvent: event,
      selectedEvent: event,
    });
  }

  onEventSubmit(err, values) {
    if (!err) {
      const {
        accounts,
        match: {
          params: { id },
        },
      } = this.props;
      const {
        drizzle: { contracts },
      } = this.context;

      contracts.Calendar.methods.reserve.cacheSend(
        id,
        moment(values.timeRange[0])
          .utc()
          .valueOf(),
        moment(values.timeRange[1])
          .utc()
          .valueOf(),
        { from: accounts[0] }
      );
    }
  }

  calendarNonExists() {
    const { contracts } = this.props;
    const { existsKey } = this.dataKeys;
    return existsKey && unbox(contracts.Calendar.exists[existsKey]) === false;
  }

  updateEvents() {
    const { contracts } = this.props;
    const { reservations: currentReservations } = this.state;

    const reservations = getAllTokensByIndex(
      this.dataKeys.reservationKeys,
      contracts.Calendar.reservationOfCalendarByIndex
    ).filter(x => x);

    if (reservations && !equal(currentReservations, reservations)) {
      const events = reservations.map(
        ({ reservationId, owner, startTime, stopTime }) => ({
          id: +reservationId,
          title: `Reserved for ${owner}`,
          owner,
          start: moment(+startTime).toDate(),
          end: moment(+stopTime).toDate(),
        })
      );
      this.setState({
        reservations,
        events,
      });
    }
  }

  render() {
    const {
      match: {
        params: { id },
      },
      contracts,
    } = this.props;
    const { events, newEvent, selectedEvent } = this.state;

    const owner = unbox(contracts.Calendar.ownerOf[this.dataKeys.ownerKey]);

    if (this.calendarNonExists()) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <h2>Calendar {id}</h2>
        {owner && (
          <h5>
            Owner: <Link to={`/${owner}`}>{owner}</Link>
          </h5>
        )}
        <Row gutter={16}>
          <Col span={16}>
            <LazyBigCalendar
              selectable
              events={this.getEvents(events, newEvent)}
              selected={selectedEvent}
              defaultView="week"
              defaultDate={this.today}
              onSelectEvent={this.onSelectEvent}
              onSelectSlot={this.onSelectSlot}
              eventPropGetter={Schedule.eventStyleGetter}
            />
          </Col>
          <Col span={8}>
            {selectedEvent && (
              <EventDetailsForm
                isUpdating={newEvent === null}
                event={selectedEvent}
                onFormSubmit={this.onEventSubmit}
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

Schedule.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = state => ({ ...state });

export default drizzleConnect(Schedule, mapStateToProps);
