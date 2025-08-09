import React from "react";

function SideBar() {
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
    </aside>
  );
}

export default SideBar;