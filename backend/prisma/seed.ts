// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany(); // optional: clears old data

  await prisma.task.createMany({
    data: [
      {
        title: "Plan weekly goals",
        description: "List top 3 goals for this week",
        completed: false,
        dueDate: new Date("2025-06-24"),
      },
      {
        title: "Polish dashboard layout",
        description: "Fix spacing on sidebar and cards",
        completed: true,
      },
      {
        title: "Integrate calendar view",
        description: "Add placeholder for daily schedule",
        completed: false,
        dueDate: new Date("2025-06-26"),
      },
    ],
  });

  console.log("✅ Seeded initial tasks.");
}

main()
  .catch((err) => {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
