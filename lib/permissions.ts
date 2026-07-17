import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  // Verify user still exists in database (handles cases where DB was re-seeded but JWT remains)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return null;
  return session.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.role !== "OWNER") {
    throw new Error("Forbidden");
  }
  return user;
}

export async function requireOwner() {
  const user = await requireUser();
  if (user.role !== "OWNER") {
    throw new Error("Forbidden");
  }
  return user;
}
