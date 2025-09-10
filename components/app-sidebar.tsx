'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  IconDashboard,
  IconFileDescription,
  IconHelp,
  IconSettings,
} from '@tabler/icons-react'

import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { CivlyLogo } from '@/components/custom/civly-logo'
import { CVData } from '@/types/cv-data'

export function AppSidebar({
  cvs = [],
  ...props
}: React.ComponentProps<typeof Sidebar> & { cvs?: CVData[] }) {
  const data = {
    navMain: [
      {
        title: 'Dashboard',
        url: '/',
        icon: IconDashboard,
        isActive: true,
      },
    ],
    resumes: {
      title: 'My Resumes',
      url: '/cv',
      icon: IconFileDescription,
      items: cvs,
    },
    navSecondary: [
      {
        title: 'Help',
        url: '#',
        icon: IconHelp,
      },
      {
        title: 'Settings',
        url: '#',
        icon: IconSettings,
      },
    ],
  }
  console.log(cvs);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 justify-center h-auto hover:!bg-transparent"
            >
              <Link href="/">
                <CivlyLogo height={52} width={106} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} resumes={data.resumes} cvs={cvs} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: 'Katrin Schmidt',
            email: 'katrin@example.com',
            avatar: '/katrin.jpg',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
