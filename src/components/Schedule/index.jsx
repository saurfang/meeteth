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
import memoize from "fast-memoize";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import EventDetailsForm from "./EventDetailsForm";
import {
  memoizedTokenOfOwnerByIndex,
  unboxNumeric,
  getAllTokensByIndex,
} from "../helpers";

import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class Schedule extends React.Component {
  static eventStyleGetter(event, start, end, isSelected) {
    const colors = chroma.brewer.Set3;
    const backgroundColor =
      colors[Math.abs(murmurhash.v3(event.owner)) % colors.length];
    const style = {
      backgroundColor: isSelected
        ? chroma.darken(backgroundColor)
        : backgroundColor,
      // borderRadius: "0px",
      // opacity: 0.8,
      color: "black",
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

    const { Calendar } = context.drizzle.contracts;

    this.state = {
      events: [],
      exists: null,
      owner: null,
      newEvent: null,
      selectedEvent: null,
      contracts: context.drizzle.contracts,
      getReservationKeys: memoizedTokenOfOwnerByIndex(
        Calendar.methods.reservationOfCalendarByIndex
      ),
      memoizedCacheCalls: {
        Calendar: {
          exists: memoize(Calendar.methods.exists.cacheCall),
          ownerOf: memoize(Calendar.methods.ownerOf.cacheCall),
          reservationBalanceOf: memoize(
            Calendar.methods.reservationBalanceOf.cacheCall
          ),
        },
      },
    };

    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.onEventSubmit = this.onEventSubmit.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { events, newEvent, selectedEvent, owner } = this.state;
    const update =
      !equal(events, nextState.events) ||
      !equal(newEvent, nextState.newEvent) ||
      !equal(selectedEvent, nextState.selectedEvent) ||
      !equal(owner, nextState.owner);

    if (update) console.log(update);
    return update;
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
      isSelected: true,
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

  static getDerivedStateFromProps(props, state) {
    const derivedState = {};

    const {
      match: {
        params: { id },
      },
    } = props;

    const { contracts, getReservationKeys, memoizedCacheCalls } = state;
    if (contracts) {
      const existsKey = memoizedCacheCalls.Calendar.exists(id);
      derivedState.exists = props.contracts.Calendar.ownerOf[existsKey];

      const ownerKey = memoizedCacheCalls.Calendar.ownerOf(id);
      derivedState.owner = props.contracts.Calendar.ownerOf[ownerKey];

      const balanceKey = memoizedCacheCalls.Calendar.reservationBalanceOf(id);

      derivedState.balance = unboxNumeric(
        props.contracts.Calendar.reservationBalanceOf[balanceKey]
      );
      if (derivedState.balance) {
        const reservationKeys = getReservationKeys(id, derivedState.balance);
        derivedState.reservations = getAllTokensByIndex(
          reservationKeys,
          props.contracts.Calendar.reservationOfCalendarByIndex
        ).filter(x => x);

        if (
          derivedState.reservations &&
          !equal(state.reservations, derivedState.reservations)
        ) {
          derivedState.events = derivedState.reservations.map(
            ({ reservationId, owner, startTime, stopTime }) => ({
              id: +reservationId,
              owner,
              start: moment(+startTime).toDate(),
              end: moment(+stopTime).toDate(),
            })
          );
        }
      }
    }

    return derivedState;
  }

  render() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const { events, newEvent, selectedEvent, owner, exists } = this.state;

    if (exists && !exists.value) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <h2>Calendar {id}</h2>
        {owner &&
          owner.value && (
            <p>
              Owner: <Link to={`/${owner.value}`}>{owner.value}</Link>
            </p>
          )}
        <Row gutter={16}>
          <Col span={16}>
            <BigCalendar
              selectable
              events={[...events, newEvent]}
              defaultView="week"
              scrollToTime={new Date(1970, 1, 1, 6)}
              defaultDate={new Date()}
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
