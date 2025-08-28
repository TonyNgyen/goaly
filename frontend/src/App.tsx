import SideBar from "./features/sidebar/sidebar";
import DailyTasks from "./features/dailyTasks/dailyTasks";
import Calendar from "./features/calendar/calendar";
import GoalOverview from "./features/goalOverview/goalOverview";

function App() {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <main className="flex-1 m-6 flex gap-6">
        <div className="flex-col flex gap-6 w-1/2">
          <DailyTasks />
          <GoalOverview />
        </div>
        <div className="flex-1 flex flex-col">
          <Calendar />
        </div>
      </main>
    </div>
  );
}

export default App;
