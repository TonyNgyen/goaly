import React from "react";

function SideBar() {
  return (
    <aside className="flex flex-col min-h-screen w-48 bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Goaly</h1>
      </div>
      <nav aria-label="Sidebar Navigation" className="flex flex-col gap-2">
        <a href="#" className="text-gray-700 hover:text-black">
          Dashboard
        </a>
        <a href="#" className="text-gray-700 hover:text-black">
          Tasks
        </a>
        <a href="#" className="text-gray-700 hover:text-black">
          Goals
        </a>
      </nav>
    </aside>
  );
}

export default SideBar;
