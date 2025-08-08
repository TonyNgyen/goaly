import React, { useState } from "react";

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour} ${ampm}`;
});

function Calendar() {
  const [events, setEvents] = useState([
    {
      title: "Meeting with team",
      start: "09:00",
      end: "11:00",
    },
  ]);

  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "09:00",
    end: "10:00",
  });

  const addEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setEvents([...events, newEvent]);
    setNewEvent({ title: "", start: "09:00", end: "10:00" });
  };

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const getTopAndHeight = (start: string, end: string) => {
    const startMin = parseTime(start);
    const endMin = parseTime(end);
    const top = (startMin / 60) * 64;
    const height = ((endMin - startMin) / 60) * 64;
    return { top, height };
  };

  return (
    <div className="bg-gray-100 flex-1 rounded-xl shadow p-6 flex flex-col">
      <h1 className="text-xl font-semibold mb-4">Calendar</h1>

      {/* Add Event Form */}
      <form onSubmit={addEvent} className="mb-4 flex gap-2 items-end">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="border p-1 rounded w-40 text-sm"
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Start</label>
          <input
            type="time"
            className="border p-1 rounded text-sm"
            value={newEvent.start}
            onChange={(e) =>
              setNewEvent({ ...newEvent, start: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End</label>
          <input
            type="time"
            className="border p-1 rounded text-sm"
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          Add Event
        </button>
      </form>

      {/* Calendar Grid */}
      <div className="bg-white h-[38rem] w-full overflow-y-auto relative rounded-lg">
        <div className="flex">
          {/* Time Labels */}
          <div className="w-16 flex flex-col text-sm text-right pr-2">
            {hours.map((hour, i) => (
              <div
                key={i}
                className="h-16 border-t border-gray-200 pr-1 text-gray-500"
              >
                {hour}
              </div>
            ))}
          </div>

          {/* Schedule Grid */}
          <div className="flex-1 relative">
            {hours.map((_, i) => (
              <div key={i} className="h-16 border-t border-gray-200" />
            ))}

            {/* Render Events */}
            {events.map((event, idx) => {
              const { top, height } = getTopAndHeight(event.start, event.end);
              return (
                <div
                  key={idx}
                  className="absolute left-0 right-0 bg-blue-500 text-white text-xs rounded p-1 shadow-md"
                  style={{
                    top,
                    height,
                    marginLeft: "4rem",
                    marginRight: "0.5rem",
                  }}
                >
                  {event.title}
                  <br />
                  {event.start} – {event.end}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
