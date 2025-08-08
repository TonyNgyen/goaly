import React, { useEffect, useRef, useState } from "react";
// import { Plus } from "lucide-react"; // optional: lucide icons

type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
};

function DailyTasks() {
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [todaysCompletedTasks, setTodaysCompletedTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const titleInputRef = useRef<HTMLInputElement>(null);

  const fetchAllTasks = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/tasks/getAllTasks");
      const data = await res.json();
      setAllTasks(data);
      return data;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Could not load tasks.");
    }
  };

  const processTasks = (tasks: Task[]) => {
    for (const task of tasks) {console.log("Task:", task);}
  };

  useEffect(() => {
    const fetchAndProcessTasks = async () => {
      try {
        const tasks = await fetchAllTasks();
        processTasks(tasks);
      } catch (err) {
        console.error("Error in useEffect:", err);
        setError("Failed to load tasks.");
      }
    };
    fetchAndProcessTasks();
  }, []);

  useEffect(() => {
    if (formOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [formOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/tasks/createTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create task");

      setForm({ title: "", description: "", dueDate: "" });
      setFormOpen(false);
      await fetchAllTasks();
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task.");
    }
  };

  const toggleComplete = async (id: number) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/tasks/${id}/toggleComplete`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) throw new Error("Failed to toggle task completion");

      await fetchAllTasks();
    } catch (err) {
      console.error("Error toggling task completion:", err);
      setError("Failed to toggle task completion.");
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow p-6 w-full h-1/2 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Daily Tasks</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </div>

      {/* Smooth expanding form */}
      <div
        className={`grid transition-all duration-300 overflow-hidden ${
          formOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden space-y-3 mb-6"
        >
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2 rounded border hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Task List */}
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-2">
          {allTasks.map((task) => (
            <li
              key={task.id}
              className={`bg-white p-3 rounded shadow flex justify-between items-center transition 
    ${task.completed ? "opacity-60 grayscale" : "opacity-100"}`}
            >
              <span
                className={`transition-all ${
                  task.completed ? "line-through" : ""
                }`}
              >
                {task.title}
              </span>
              <div className="flex items-center gap-4">
                <span
                  className={`text-sm ${
                    task.completed ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                >
                  {task.completed ? "Mark Pending" : "Mark Done"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DailyTasks;
