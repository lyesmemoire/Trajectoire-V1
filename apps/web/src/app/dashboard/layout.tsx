import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <DashboardSidebar />
      <div className="lg:pl-64">
        <DashboardTopbar />
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
