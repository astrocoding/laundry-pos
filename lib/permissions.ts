import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
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
