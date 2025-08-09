import React, { useEffect, useRef, useState } from "react";

type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  pendingAt?: string;
};

function DailyTasks() {
  const [allTasks, setAllTasks] = useState<Record<number, Task>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (formOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [formOpen]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/tasks/getAllTasks");
        const data = await res.json();
        const tasks: Record<number, Task> = {};
        data.forEach((task: Task) => {
          tasks[task.id] = task;
        });
        setAllTasks(tasks);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    const id = Date.now();
    const now = new Date().toISOString();

    const newTask: Task = {
      id,
      title: form.title.trim(),
      description: form.description.trim() || "",
      dueDate: form.dueDate || "",
      completed: false,
      createdAt: now,
      pendingAt: now,
    };

    setAllTasks((prev) => ({ [id]: newTask, ...prev }));
    setForm({ title: "", description: "", dueDate: "" });
    setFormOpen(false);
  };

  const toggleComplete = (id: number) => {
    setAllTasks((prev) => {
      const task = prev[id];
      const now = new Date().toISOString();

      const updatedTask: Task = {
        ...task,
        completed: !task.completed,
        completedAt: !task.completed ? now : undefined,
        pendingAt: task.completed ? now : undefined,
      };

      return { ...prev, [id]: updatedTask };
    });
  };

  const pendingTasks = Object.values(allTasks)
    .filter((t) => !t.completed)
    .sort((a, b) => {
      return (
        new Date(a.pendingAt || a.createdAt).getTime() -
        new Date(b.pendingAt || b.createdAt).getTime()
      );
    });

  const completedTasks = Object.values(allTasks)
    .filter((t) => t.completed)
    .sort((a, b) => {
      return (
        new Date(a.completedAt || a.createdAt).getTime() -
        new Date(b.completedAt || b.createdAt).getTime()
      );
    });

  return (
    <div className="bg-gray-100 rounded-xl shadow p-6 w-full h-1/2 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Daily Tasks</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center gap-2 bg-[#00509d] text-white px-4 py-2 rounded hover:bg-[#003f88] transition cursor-pointer text-base font-medium"
        >
          Add Task
        </button>
      </div>

      {/* Smooth expanding form */}
      <div
        className={`grid transition-all duration-300 overflow-hidden ${
          formOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0"
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
            className="w-full p-2 bg-white border border-gray-300 rounded"
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 bg-white border border-gray-300 rounded"
          />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full p-2 bg-white border border-gray-300 rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="w-24 py-2 rounded border border-gray-300 bg-white hover:bg-gray-200 transition cursor-pointer text-base font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#2C6E49] text-white w-24 py-2 rounded hover:bg-green-800 transition cursor-pointer text-base font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>

      {/* Task List */}
      <ul className="space-y-2">
        {[...pendingTasks, ...completedTasks].map((task) => (
          <li
            key={task.id}
            className={`bg-white p-3 rounded shadow flex justify-between items-center transition 
              ${task.completed ? "opacity-60 grayscale" : "opacity-100"}`}
          >
            <div className="flex flex-col">
              <span className="font-medium">{task.title}</span>
              {task.description && (
                <span className=" text-gray-500">
                  {task.description}
                </span>
              )}
              {task.dueDate && (
                <span className="text-xs text-gray-400">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleComplete(task.id)}
                className="px-3 py-2 bg-[#00509d] text-white rounded hover:bg-[#003f88] transition  cursor-pointer text-base font-medium"
              >
                {task.completed ? "Undo" : "Complete"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DailyTasks;
