import React, { useEffect, useState } from "react";

function SideBar() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = now.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <aside className="flex flex-col min-h-screen w-48 bg-[#ffb703] p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Goaly</h1>
      </div>
      <nav aria-label="Sidebar Navigation" className="flex flex-col gap-2">
        <a href="#" className="text-black text-lg font-medium">
          Dashboard
        </a>
        <a href="#" className="text-black text-lg font-medium">
          Tasks
        </a>
        <a href="#" className="text-black text-lg font-medium">
          Goals
        </a>
      </nav>
      <div className="mt-auto bg-white rounded-lg shadow p-3 text-center">
        <div className="text-sm text-gray-500">{formattedDate}</div>
        <div className="text-lg font-semibold text-black">{formattedTime}</div>
      </div>
    </aside>
  );
}

export default SideBar;
