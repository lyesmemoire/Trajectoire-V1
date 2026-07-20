export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-muted">
      <main className="p-6 lg:p-8">{children}</main>
    </div>
  );
}
