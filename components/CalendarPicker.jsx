import { buildMonth, dateToKey, isAvailableDate, isDarkDate, monthNames, today } from "../lib/booking-data";

export function CalendarPicker({ visibleMonth, selectedDateKey, onMonthChange, onToday, onDateGridClick }) {
  const calendarDates = buildMonth(visibleMonth.getFullYear(), visibleMonth.getMonth());

  return (
    <section className="calendar" aria-label={`${monthNames[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()} calendar`}>
      <div className="calendar-title">
        <h3>{monthNames[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}</h3>
        <div className="month-arrows">
          <button className="up" type="button" aria-label="Previous month" onClick={() => onMonthChange(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1))}></button>
          <button className="down" type="button" aria-label="Next month" onClick={() => onMonthChange(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1))}></button>
        </div>
      </div>

      <div className="weekdays" aria-hidden="true">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>

      <div className="dates" onClick={onDateGridClick}>
        {calendarDates.map((date, index) => {
          const isEmpty = !date;
          const isSelected = date ? dateToKey(date) === selectedDateKey : false;
          const isAvailable = date ? isAvailableDate(date) : false;
          const isDark = date ? isDarkDate(date) : false;
          const className = [
            isEmpty ? "muted empty" : "",
            !isEmpty && !isAvailable && !isDark && !isSelected ? "muted" : "",
            isAvailable && !isSelected ? "available" : "",
            isSelected ? "selected-date" : ""
          ].filter(Boolean).join(" ");

          return (
            <button className={className} type="button" tabIndex={isEmpty ? -1 : undefined} aria-current={isSelected ? "date" : undefined} data-date-key={date ? dateToKey(date) : undefined} key={date ? date.toISOString() : `empty-${index}`}>
              {date ? date.getDate() : ""}
            </button>
          );
        })}
      </div>

      <button className="today" type="button" onClick={() => onToday(new Date(today.getFullYear(), today.getMonth(), 1), dateToKey(today))}>
        Today
      </button>
    </section>
  );
}
