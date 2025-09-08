'use client'

import {
  IconCirclePlusFilled,
  IconChevronDown,
  type Icon,
} from '@tabler/icons-react'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

export function NavMain({
  items,
  resumes,
  cvs
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    isActive?: boolean
  }[]
  resumes?: {
    title: string
    url: string
    icon?: Icon
    items: {
      id: string;
      visibility: string;
    }[]
  },
  cvs: [{
    id: string;
    visibility: string;
    //name: string;
  }]
}) {
  const [isResumesOpen, setIsResumesOpen] = useState(true)
  const pathname = usePathname()
  if(resumes) {
  let resumesNew = resumes;
  resumesNew.items = cvs;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>New Resume</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className="!bg-transparent hover:!bg-primary/10"
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon />}
                    <span className={isActive ? 'font-bold' : ''}>
                      {item.title}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}

          {/* My Resumes Collapsible Item */}
          {resumes && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() => setIsResumesOpen(!isResumesOpen)}
                className="w-full justify-between hover:!bg-primary/10"
              >
                <div className="flex items-center gap-2">
                  {resumes.icon && <resumes.icon className="h-4 w-4" />}
                  <span>{resumes.title}</span>
                </div>
                <IconChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isResumesOpen ? 'rotate-180' : ''
                  }`}
                />
              </SidebarMenuButton>
              {isResumesOpen && (
                <SidebarMenuSub>
                  {resumes && resumes.items && resumes.items.map((item) => (
                    <SidebarMenuSubItem key={item.id}>
                      <SidebarMenuSubButton
                        asChild
                        className="hover:!bg-primary/10"
                      >
                        <a href={'/cv/'+item.id}>
                          <span>{item.id}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
