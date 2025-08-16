import React, { useEffect, useRef, useState } from "react";

type Goal = {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
};

function GoalOverview() {
  const [allGoals, setAllGoals] = useState<Record<number, Goal>>({});
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus input when form opens
  useEffect(() => {
    if (formOpen) {
      titleInputRef.current?.focus();
    }
  }, [formOpen]);

  // Fetch goals from backend
  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/goals");
        const data = await res.json();
        const goals: Record<number, Goal> = {};
        data.forEach((goal: Goal) => {
          goals[goal.id] = goal;
        });
        setAllGoals(goals);
      } catch (err) {
        console.error("Failed to fetch goals:", err);
      }
    };
    fetchGoals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create goal");
      }

      const newGoal: Goal = await res.json();

      // Merge it into state
      setAllGoals((prev) => ({ [newGoal.id]: newGoal, ...prev }));

      // Reset form
      setForm({ title: "", description: "" });
      setFormOpen(false);
    } catch (err) {
      console.error("Error creating goal:", err);
    }
  };

  return (
    <div className="bg-gray-100 rounded-xl shadow p-6 w-full h-1/2 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Goal Overview</h2>
        {formOpen ? (
          <button
            onClick={() => setFormOpen(false)}
            className="flex items-center gap-2 bg-[#00509d] text-white px-4 py-2 rounded hover:bg-[#003f88] transition cursor-pointer text-base font-medium"
          >
            Cancel
          </button>
        ) : (
          <button
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-2 bg-[#00509d] text-white px-4 py-2 rounded hover:bg-[#003f88] transition cursor-pointer text-base font-medium"
          >
            Add Goal
          </button>
        )}
      </div>

      {/* Smooth expanding form */}
      <div
        className={`grid transition-all duration-300 overflow-hidden ${
          formOpen
            ? "grid-rows-[1fr] opacity-100 mt-4"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden space-y-3 mb-6"
        >
          <div>
            <label
              htmlFor="goal-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="goal-title"
              ref={titleInputRef}
              type="text"
              placeholder="Goal title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 bg-white border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label
              htmlFor="goal-desc"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <input
              id="goal-desc"
              type="text"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-2 bg-white border border-gray-300 rounded"
            />
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

      {/* Goal List */}
      <ul className="space-y-2">
        {Object.values(allGoals).map((goal) => (
          <li
            key={goal.id}
            className="bg-white p-3 rounded shadow flex justify-between items-center"
          >
            <div className="flex flex-col">
              <span className="font-medium">{goal.title}</span>
              {goal.description && (
                <span className="text-gray-500">{goal.description}</span>
              )}
            </div>
            <span className="text-xs text-gray-400">
              Created: {new Date(goal.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GoalOverview;
