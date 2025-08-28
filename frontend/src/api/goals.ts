export type Goal = {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  completionPercentage: number;
  completed: boolean;
};

export const fetchGoals = async (): Promise<Goal[]> => {
  const res = await fetch("http://localhost:4000/api/goals");
  if (!res.ok) throw new Error("Failed to fetch goals");
  return res.json();
};

export const createGoal = async (goal: Partial<Goal>): Promise<Goal> => {
  const res = await fetch("http://localhost:4000/api/goals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error("Failed to create goal");
  return res.json();
};
