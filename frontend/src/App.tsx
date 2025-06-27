import { useEffect, useState } from "react";
import SideBar from "./features/sidebar/sidebar";
import DailyTasks from "./features/dailyTasks/dailyTasks";
import Calendar from "./features/calendar/calendar";
import WeeklyOverview from "./features/weeklyOverview/weeklyOverview";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/message");
        const data = await res.json();
        setMessage(data.message);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch message.");
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* <h1 className="font-bold">Frontend + Backend Connection</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>{message || "Loading..."}</p>
      )} */}
      <SideBar />
      <main className="flex-1 m-6 flex gap-6">
        <div className="flex-col flex gap-6 w-1/2">
          <DailyTasks />
          <WeeklyOverview />
        </div>
        <div className="flex-1 flex flex-col">
          <Calendar />
        </div>
      </main>
    </div>
  );
}

export default App;
