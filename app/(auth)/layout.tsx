import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "LaundryPOS",
    template: "%s | LaundryPOS",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-gray-50">{children}</main>
    </AuthProvider>
  );
}
