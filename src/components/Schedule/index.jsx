import { Row, Col } from "antd";
import { drizzleConnect } from "drizzle-react";
import moment from "moment";
import React from "react";
import BigCalendar from "react-big-calendar";
import ReactRouterPropTypes from "react-router-prop-types";
import PropTypes from "prop-types";
import equal from "fast-deep-equal";
import memoize from "fast-memoize";

import EventDetailsForm from "./EventDetailsForm";

import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

class Schedule extends React.Component {
  static propTypes = {
    match: ReactRouterPropTypes.match.isRequired,
  };

  constructor(props, context) {
    super(props);

    this.state = {
      events: [
        {
          id: 0,
          title: "Lunch",
          start: moment()
            .add(7, "hours")
            .toDate(),
          end: moment()
            .add(8, "hours")
            .toDate(),
          desc: "Power lunch",
        },
      ],
      newEvent: null,
      selectedEvent: null,
      contracts: context.drizzle.contracts,
      dataKeys: {},
      reservationKeys: memoize((id, balance) =>
        Array.from(Array(balance).keys()).map(i =>
          context.drizzle.contracts.Calendar.methods.reservationOfCalendarByIndex.cacheCall(
            id,
            i
          )
        )
      ),
    };

    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
    this.onEventSubmit = this.onEventSubmit.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { events, newEvent, selectedEvent } = this.state;
    const update =
      !equal(events, nextState.events) ||
      !equal(newEvent, nextState.newEvent) ||
      !equal(selectedEvent, nextState.selectedEvent);

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
    const { newEvent } = this.state;
    const event = {
      id: -1,
      isSelected: true,
      title: newEvent && newEvent.title,
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
        values.timeRange[0].utc().valueOf(),
        values.timeRange[1].utc().valueOf(),
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

    const { contracts, reservationKeys } = state;
    if (contracts) {
      derivedState.dataKeys = {
        ...derivedState.dataKeys,
        balance: contracts.Calendar.methods.reservationBalanceOf.cacheCall(id),
      };

      const balance =
        props.contracts.Calendar.reservationBalanceOf[
          derivedState.dataKeys.balance
        ];
      derivedState.balance =
        (balance &&
          !Object.prototype.hasOwnProperty.call(balance, "error") &&
          +balance.value) ||
        0;
      if (derivedState.balance) {
        derivedState.dataKeys = {
          ...derivedState.dataKeys,
          reservations: reservationKeys(id, derivedState.balance),
        };
        derivedState.reservations =
          derivedState.balance &&
          Array.from(Array(derivedState.balance).keys())
            .map(i => {
              const reservationKey =
                derivedState.dataKeys.reservations &&
                i < derivedState.dataKeys.reservations.length &&
                derivedState.dataKeys.reservations[i];
              const { reservationOfCalendarByIndex } = props.contracts.Calendar;
              const reservation =
                reservationKey &&
                reservationOfCalendarByIndex[reservationKey] &&
                reservationOfCalendarByIndex[reservationKey].value;
              return reservation;
            })
            .filter(x => x);

        if (
          derivedState.reservations &&
          !equal(state.reservations, derivedState.reservations)
        ) {
          derivedState.events = derivedState.reservations.map(
            ({ reservationId, renter, startTime, stopTime }) => ({
              id: +reservationId,
              title: renter,
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
    const { events, newEvent, selectedEvent } = this.state;

    return (
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
    );
  }
}

Schedule.contextTypes = {
  drizzle: PropTypes.object,
};

const mapStateToProps = state => ({ ...state });

export default drizzleConnect(Schedule, mapStateToProps);
