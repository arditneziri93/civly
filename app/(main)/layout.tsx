import { SidebarWrapper } from '@/components/sidebarWrapper'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider>
      <SidebarWrapper />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-4 min-w-0">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
