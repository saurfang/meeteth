import { Row, Col, Alert } from "antd";
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

import EventDetailsForm from "../Calendar/EventDetailsForm";
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
      color,
    };
    return {
      style,
    };
  }

  static propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
    account: PropTypes.string,
    contracts: PropTypes.object,
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
    this.ownerValidator = [
      {
        validator: (rule, value, callback) =>
          context.drizzle.web3.utils.isAddress(value)
            ? callback()
            : callback([new Error("Invalid address")]),
        message: "Please enter a valid Ethereum address",
        required: true,
      },
    ];

    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.onEventCreate = this.onEventCreate.bind(this);
    this.onEventTransfer = this.onEventTransfer.bind(this);
    this.onEventCancel = this.onEventCancel.bind(this);
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
      // NB: limit number of events to prevent browser performance issue
      // TODO: add pagination and only fetch viewable events based on calendar time range
      const EVENTS_LIMIT = 100;
      if (balance > EVENTS_LIMIT) {
        this.balanceOverLimit = true;
      }
      this.dataKeys.reservationKeys = this.getReservationKeys(
        id,
        Math.min(balance, EVENTS_LIMIT)
      );
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
    const { account } = this.props;
    const { newEvent } = this.state;
    const event = {
      id: -1,
      title: newEvent && newEvent.title,
      owner: account,
      ...slotInfo,
    };
    this.setState({
      newEvent: event,
      selectedEvent: event,
    });
  }

  onEventCreate(err, values) {
    if (!err) {
      const {
        account,
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
        { from: account }
      );
    }
  }

  onEventTransfer(err, values) {
    if (!err) {
      const { account } = this.props;
      const {
        drizzle: { contracts },
      } = this.context;

      contracts.Reservation.methods.safeTransferFrom.cacheSend(
        account,
        values.owner,
        values.id,
        {
          from: account,
          // gas limit can be underestimated
          gasLimit: "300000",
        }
      );
    }
  }

  onEventCancel(err, values) {
    if (!err) {
      const {
        account,
        match: {
          params: { id },
        },
      } = this.props;
      const {
        drizzle: { contracts },
      } = this.context;

      contracts.Calendar.methods.cancel.cacheSend(id, values.id, {
        from: account,
        // gas limit estimation is incorrect
        gasLimit: "400000",
      });
    }
  }

  calendarNonExists() {
    const { contracts } = this.props;
    const { existsKey } = this.dataKeys;
    return existsKey && unbox(contracts.Calendar.exists[existsKey]) === false;
  }

  updateEvents() {
    const { contracts } = this.props;
    const { reservations: currentReservations, newEvent } = this.state;

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
      const newEventCreated =
        newEvent &&
        events.find(
          ({ owner, start, end }) =>
            owner === newEvent.owner &&
            start.getTime() === newEvent.start.getTime() &&
            end.getTime() === newEvent.end.getTime()
        );
      if (newEventCreated) {
        this.setState({
          reservations,
          events,
          selectedEvent: newEventCreated,
          newEvent: null,
        });
      } else {
        this.setState({
          reservations,
          events,
        });
      }
    }
  }

  render() {
    const {
      match: {
        params: { id },
      },
      contracts,
      account,
    } = this.props;
    const { events, newEvent, selectedEvent } = this.state;

    const owner = unbox(contracts.Calendar.ownerOf[this.dataKeys.ownerKey]);

    if (this.calendarNonExists()) {
      return <Redirect to="/" />;
    }

    const buttons =
      selectedEvent &&
      [
        newEvent !== null && {
          text: "Create",
          onClick: this.onEventCreate,
        },
        newEvent === null &&
          selectedEvent.owner === account && {
            text: "Transfer",
            onClick: this.onEventTransfer,
          },
        newEvent === null &&
          selectedEvent.owner === account && {
            text: "Cancel",
            onClick: this.onEventCancel,
          },
      ].filter(x => x);

    const rules = selectedEvent && {
      owner:
        newEvent === null &&
        selectedEvent.owner === account &&
        this.ownerValidator,
    };

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
            {this.balanceOverLimit && (
              <Alert
                message="Calendar contains too many events! Only fetching first 100."
                type="warning"
                showIcon
              />
            )}
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
                buttons={buttons}
                event={selectedEvent}
                rules={rules}
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

const mapStateToProps = ({ accounts, contracts }) => ({
  account: accounts && accounts[0],
  contracts,
});

export default drizzleConnect(Schedule, mapStateToProps);
