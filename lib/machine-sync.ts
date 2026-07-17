import { prisma } from "@/lib/prisma";

export async function syncMachineStatuses() {
  const now = new Date();
  
  // Find all running sessions that have ended
  const expiredSessions = await prisma.machineSession.findMany({
    where: {
      status: "RUNNING",
      endsAt: { lte: now }
    }
  });

  if (expiredSessions.length > 0) {
    const expiredMachineIds = expiredSessions.map(s => s.machineId);
    const expiredSessionIds = expiredSessions.map(s => s.id);
    
    // We update in a transaction to ensure both machine and session update
    await prisma.$transaction([
      prisma.machineSession.updateMany({
        where: { id: { in: expiredSessionIds } },
        data: { status: "COMPLETED" }
      }),
      prisma.machine.updateMany({
        where: { id: { in: expiredMachineIds } },
        data: { status: "AVAILABLE" }
      })
    ]);
  }
}
