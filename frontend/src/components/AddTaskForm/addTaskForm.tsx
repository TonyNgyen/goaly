import React, { useState, useEffect, useRef } from "react";

type Goal = {
  id: number;
  title: string;
};

function AddTaskForm({
  formOpen,
  setFormOpen,
  onTaskCreated,
}: {
  formOpen: boolean;
  setFormOpen: (open: boolean) => void;
  onTaskCreated: () => void;
}) {
  const titleInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    goalId: "",
  });

  const [goals, setGoals] = useState<Goal[]>([]);

  // Fetch goals for dropdown
  useEffect(() => {
    if (formOpen) {
      fetch("http://localhost:4000/api/goals")
        .then((res) => res.json())
        .then((data) => setGoals(data))
        .catch((err) => console.error("Failed to load goals:", err));
    }
  }, [formOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.goalId) {
      alert("Please provide a title and select a goal.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          dueDate: form.dueDate || null,
          goalId: Number(form.goalId),
        }),
      });

      if (!res.ok) throw new Error("Failed to create task");

      const newTask = await res.json();
      console.log("✅ Created task:", newTask);

      // Reset form + close
      setForm({ title: "", description: "", dueDate: "", goalId: "" });
      setFormOpen(false);
      onTaskCreated();
    } catch (err) {
      console.error(err);
      alert("Something went wrong creating the task");
    }
  };

  return (
    <div
      className={`grid transition-all duration-300 overflow-hidden ${
        formOpen
          ? "grid-rows-[1fr] opacity-100 mt-4"
          : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <form onSubmit={handleSubmit} className="overflow-hidden space-y-3 mb-6">
        <div>
          <label
            htmlFor="task-title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="task-title"
            ref={titleInputRef}
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 bg-white border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="task-desc"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <input
            id="task-desc"
            type="text"
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 bg-white border border-gray-300 rounded"
          />
        </div>

        <div>
          <label
            htmlFor="task-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Due Date
          </label>
          <input
            id="task-date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="w-full p-2 bg-white border border-gray-300 rounded"
          />
        </div>

        {/* ✅ New Goal Selector */}
        <div>
          <label
            htmlFor="task-goal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Goal
          </label>
          <select
            id="task-goal"
            value={form.goalId}
            onChange={(e) => setForm({ ...form, goalId: e.target.value })}
            className="w-full p-2 bg-white border border-gray-300 rounded"
            required
          >
            <option value="" disabled>
              Select a goal
            </option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>

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
  );
}

export default AddTaskForm;
