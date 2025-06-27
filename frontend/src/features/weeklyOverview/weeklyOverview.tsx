import React from "react";

function WeeklyOverview() {
  return (
    <div className="bg-gray-100 rounded-xl shadow p-6 w-full h-1/2">
      <h2 className="text-xl font-semibold mb-4">Weekly Overview</h2>
      <ul className="space-y-2">{/* Task items go here */}</ul>
    </div>
  );
}

export default WeeklyOverview;
