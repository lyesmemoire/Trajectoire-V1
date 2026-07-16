import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { DashboardLayout as DashboardLayoutComponent } from "@/components/dashboard/dashboard-layout";
import { generateMetadata, pageMetadata } from "@/components/seo/metadata";

export const metadata = generateMetadata(pageMetadata.dashboard);

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard");
  }

  return (
    <DashboardLayoutComponent>
      {children}
    </DashboardLayoutComponent>
  );
}
