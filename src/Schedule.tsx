import moment from "moment";
import React from "react";
import BigCalendar from "react-big-calendar";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

export default class Schedule extends React.Component {
  public render() {
    return (
      <>
        <BigCalendar
          selectable={true}
          events={[]}
          defaultView={'week'}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={this.onSelectEvent}
          onSelectSlot={this.onSelectSlot}
        />
      </>
    );
  }

  private onSelectEvent(event: any) {
    alert(event.title);
  }

  private onSelectSlot(slotInfo: any) {
    alert(
      `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
      `\nend: ${slotInfo.end.toLocaleString()}` +
      `\naction: ${slotInfo.action}`
    )
  }
}
