import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Delete the bad row
  const badRowName = "Call Recordings Starts From 27-07-2024 onwards";
  const deleted = await prisma.customer.deleteMany({
    where: { name: { contains: "Call Recordings Starts" } }
  });
  console.log(`Deleted ${deleted.count} bad rows.`);

  await prisma.$disconnect();
}

main().catch(console.error);
