'use client'

import {
  IconCirclePlusFilled,
  IconChevronDown,
  type Icon,
} from '@tabler/icons-react'
import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CVData } from '@/types/cv-data'
import {useRouter} from "next/navigation"
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
import { createClient } from '@/utils/supabase/client'

export function NavMain({
  items,
  resumes,
  cvs,
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
    items: CVData[]
  }
  cvs: CVData[]
}) {
  const router = useRouter();
  const [isResumesOpen, setIsResumesOpen] = useState(true)
  const pathname = usePathname()

  //create a new blank cv
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const supabase = await createClient()
    const { data: newcv, error } = await supabase.functions.invoke('restful-api/cv', {
      body: {cv:{name: 'Resume'}}
    });
    router.refresh()
  }

  // Function to get CV display name
  const getCvDisplayName = (cv: CVData) => {
    // First priority: use the CV name field if it exists
    if (cv.name && cv.name.trim()) {
      return cv.name.trim()
    }

    // Second priority: use personal information
    const personalInfo = cv.personalInformation || {}
    const name = personalInfo.name || ''
    const surname = personalInfo.surname || ''

    if (name || surname) {
      return `CV - ${name} ${surname}`.trim()
    }

    // Third priority: use email
    const email = personalInfo.email || ''
    if (email) {
      return `CV - ${email.split('@')[0]}`
    }

    // Fallback to ID or date
    const dateStr = cv.created_at
      ? new Date(cv.created_at).toLocaleDateString()
      : ''
    return `CV - ${dateStr || cv.id.toString().slice(0, 8)}`
  }

  if (resumes) {
    const resumesNew = resumes
    resumesNew.items = cvs
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <form onSubmit={onSubmit}>
              <SidebarMenuButton
                tooltip="Create new CV"
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
              >
                <IconCirclePlusFilled />
                <span>New Resume</span>
              </SidebarMenuButton>
            </form>
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
                  {resumes && resumes.items && resumes.items.length > 0 ? (
                    resumes.items.map((cv) => (
                      <SidebarMenuSubItem key={cv.id}>
                        <SidebarMenuSubButton
                          asChild
                          className="hover:!bg-primary/10"
                        >
                          <Link href={'/cv/' + cv.id}>
                            <span className="text-sm ">
                              {getCvDisplayName(cv)}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))
                  ) : (
                    <SidebarMenuSubItem>
                      <div className="px-2 py-1 text-sm text-muted-foreground">
                        No Resumes Found
                      </div>
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
