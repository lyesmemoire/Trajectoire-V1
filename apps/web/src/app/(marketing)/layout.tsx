import Footer from "@/components/layout/Footer"
import { Navbar } from "@/components/layout/Navbar"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <div id="main" className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}
