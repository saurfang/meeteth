import { Row, Col, Form } from "antd";
import moment from "moment";
import React from "react";
import BigCalendar from "react-big-calendar";

import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

export default class Schedule extends React.PureComponent {
  constructor(props) {
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
      newEvent: undefined,
      selectedEvent: undefined,
    };

    this.onSelectEvent = this.onSelectEvent.bind(this);
    this.onSelectSlot = this.onSelectSlot.bind(this);
  }

  onSelectEvent(event) {
    const { selectedEvent } = this.state;
    if (selectedEvent.id !== event.id) {
      this.setState({
        newEvent: undefined,
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
        <Col span={8}>{JSON.stringify(selectedEvent)}</Col>
      </Row>
    );
  }
}
