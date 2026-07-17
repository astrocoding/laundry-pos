import { TopNav } from "@/components/layout/TopNav";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <main className="flex-1">{children}</main>
    </>
  );
}
