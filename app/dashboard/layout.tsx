import DashboardTabs from "@/components/DashboardTabs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardTabs />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
