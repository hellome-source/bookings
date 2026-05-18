import { formatSelectedDate } from "../lib/booking-data";
import { CheckCircleIcon } from "./icons";

export function TimePicker({ selectedDate, selectedTime, availableTimes, onTimeListClick }) {
  return (
    <section className="times" aria-label={`Available times for ${formatSelectedDate(selectedDate)}`}>
      <h3>{formatSelectedDate(selectedDate)}</h3>
      <div className="time-list" onClick={onTimeListClick}>
        {availableTimes.map((time) => (
          <button className={`time-slot${selectedTime === time ? " selected" : ""}`} type="button" data-time={time} key={time}>
            <span>{time}</span>
            <CheckCircleIcon />
          </button>
        ))}
      </div>
    </section>
  );
}
