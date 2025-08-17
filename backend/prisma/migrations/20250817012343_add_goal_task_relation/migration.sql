-- CreateTable
CREATE TABLE "GoalTask" (
    "goalId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,

    CONSTRAINT "GoalTask_pkey" PRIMARY KEY ("goalId","taskId")
);

-- AddForeignKey
ALTER TABLE "GoalTask" ADD CONSTRAINT "GoalTask_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalTask" ADD CONSTRAINT "GoalTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
