export type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  pendingAt?: string;
};

export const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch("http://localhost:4000/api/tasks");
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const res = await fetch("http://localhost:4000/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const toggleTask = async (id: number): Promise<Task> => {
  const res = await fetch(
    `http://localhost:4000/api/tasks/${id}/toggleComplete`,
    { method: "PATCH" }
  );
  if (!res.ok) throw new Error("Failed to toggle task");
  return res.json();
};
