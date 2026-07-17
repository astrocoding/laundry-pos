import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { TopNavClient } from "./TopNavClient";

/**
 * Server Component — reads session via getServerSession() (no client fetch)
 * and immediately passes data to TopNavClient as props.
 * This eliminates the useSession() loading delay.
 */
export async function TopNav() {
  const session = await getServerSession(authOptions);

  if (!session?.user) return null;

  const role = (session.user as { role?: string }).role ?? "CASHIER";
  const userName = session.user.name ?? "User";
  const userEmail = session.user.email ?? "";

  return <TopNavClient role={role} userName={userName} userEmail={userEmail} />;
}
