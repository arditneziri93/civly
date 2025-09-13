'use client'

import {
  IconCirclePlusFilled,
  IconChevronDown,
  IconPlus,
  type Icon,
} from '@tabler/icons-react'
import { FormEvent, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CvData } from '@/schemas/cv_data_schema'
import { useRouter } from 'next/navigation'
import { ResumeCardMenu } from '@/components/custom/resume-card-menu'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
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
    items: CvData[]
  }
  cvs: CvData[]
}) {
  const router = useRouter()
  const [isResumesOpen, setIsResumesOpen] = useState(false)
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null)
  // State for cascade animation effects
  const [visibleCvs, setVisibleCvs] = useState<Set<number>>(new Set())
  const [disappearingCvs, setDisappearingCvs] = useState<Set<number>>(new Set())
  const pathname = usePathname()

  // Cascade effect for "My Resumes" section
  useEffect(() => {
    if (cvs.length > 0) {
      if (isResumesOpen) {
        // Opening: Show items progressively with cascade
        setDisappearingCvs(new Set()) // Clear any disappearing state
        cvs.forEach((_, index) => {
          setTimeout(() => {
            setVisibleCvs((prev) => new Set([...prev, index]))
          }, index * 35) // Faster, smoother cascade
        })
      } else {
        // Closing: Hide items in reverse cascade (last item disappears first)
        setVisibleCvs(new Set()) // Clear visible state immediately
        cvs
          .slice()
          .reverse()
          .forEach((_, reverseIndex) => {
            const originalIndex = cvs.length - 1 - reverseIndex
            setTimeout(() => {
              setDisappearingCvs((prev) => new Set([...prev, originalIndex]))
            }, reverseIndex * 35) // Faster, smoother reverse cascade
          })
        // Clear disappearing state after animation completes
        setTimeout(() => {
          setDisappearingCvs(new Set())
        }, cvs.length * 35 + 150) // Adjusted cleanup timing
      }
    }
  }, [isResumesOpen, cvs])

  // Create a new blank CV
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSelectedCvId(null) // Clear any selected CV
    const supabase = await createClient()
    await supabase.functions.invoke('restful-api/cv', {
      body: { cv: { name: 'Resume' } },
    })
    router.refresh()
  }

  // Function to get CV display name
  const getCvDisplayName = (cv: CvData) => {
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
    const dateStr = cv.createdAt
      ? new Date(cv.createdAt).toLocaleDateString()
      : ''
    return `CV - ${dateStr || cv.id?.toString().slice(0, 8)}`
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
            <form onSubmit={onSubmit} className="w-full">
              <SidebarMenuButton
                tooltip="Create new CV"
                type="submit"
                className="bg-primary text-primary-foreground  hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8  duration-200 ease-linear"
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
                  <Link href={item.url} onClick={() => setSelectedCvId(null)}>
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
                onClick={() => {
                  setIsResumesOpen(!isResumesOpen)
                  setSelectedCvId(null)
                }}
                className="w-full justify-between hover:!bg-primary/10"
              >
                <div className="flex items-center gap-2">
                  {resumes.icon && <resumes.icon className="h-4 w-4" />}
                  <span>{resumes.title}</span>
                </div>
                <IconChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isResumesOpen ? 'rotate-180' : ''
                  }`}
                />
              </SidebarMenuButton>
              <div
                className={`overflow-y-auto transition-all duration-300 ease-in-out ${
                  isResumesOpen
                    ? 'max-h-[70vh] opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <SidebarMenuSub className="mx-0 px-0 gap-0.5">
                  {resumes && resumes.items && resumes.items.length > 0 ? (
                    <>
                      {resumes.items.map((cv, index) => {
                        // Only the selected CV is active
                        const isActiveCv = selectedCvId === cv.id?.toString()
                        const isVisible = visibleCvs.has(index)
                        const isDisappearing = disappearingCvs.has(index)

                        return (
                          <SidebarMenuSubItem
                            key={cv.id}
                            className={`relative transition-all duration-300 ease-out ml-6 ${
                              isDisappearing
                                ? 'opacity-0 scale-95 -translate-y-4 max-h-0 overflow-hidden transform' // Smoother disappearing with more movement
                                : isVisible
                                ? 'opacity-100 scale-100 translate-y-0 max-h-12 transform' // Visible state with transform
                                : 'opacity-0 scale-90 translate-y-2 max-h-0 overflow-hidden transform' // Hidden state with subtle positioning
                            }`}
                            style={{
                              transitionDelay: isDisappearing
                                ? '0ms' // No delay for disappearing items
                                : isVisible
                                ? `${
                                    cvs.findIndex((c) => c.id === cv.id) * 20
                                  }ms` // Smoother staggered appearance
                                : '0ms',
                            }}
                          >
                            <div
                              className={`group/item flex items-center w-full hover:bg-primary/10 rounded-md transition-colors ${
                                isActiveCv ? 'bg-primary/10' : ''
                              }`}
                            >
                              <Link
                                href={'/editor'}
                                className="flex items-center flex-1 pl-2 py-1 min-h-8"
                                onClick={() =>
                                  setSelectedCvId(cv.id?.toString() || null)
                                }
                              >
                                <span
                                  className={`text-sm ${
                                    isActiveCv ? 'font-bold' : ''
                                  }`}
                                >
                                  {getCvDisplayName(cv)}
                                </span>
                              </Link>
                              <div className="opacity-0 group-hover/item:opacity-100 transition-opacity py-1 pr-2 flex items-center justify-center">
                                <ResumeCardMenu
                                  onEdit={() => {
                                    // Navigate to edit mode
                                    router.push(`/editor`)
                                  }}
                                  onShare={() => {
                                    // TODO: Implement share functionality
                                    console.log('Share CV:', cv.id)
                                  }}
                                  onDuplicate={() => {
                                    // TODO: Implement duplicate functionality
                                    console.log('Duplicate CV:', cv.id)
                                  }}
                                  onExportPdf={() => {
                                    // TODO: Implement PDF export functionality
                                    console.log('Export PDF:', cv.id)
                                  }}
                                  onDelete={() => {
                                    // TODO: Implement delete functionality
                                    console.log('Delete CV:', cv.id)
                                  }}
                                />
                              </div>
                            </div>
                          </SidebarMenuSubItem>
                        )
                      })}

                      {/* Add New Resume Button at the end of the list */}
                      <SidebarMenuSubItem className="ml-6">
                        <form onSubmit={onSubmit}>
                          <button
                            type="submit"
                            className="flex items-center justify-start pl-2 pr-2 py-1 min-h-8 text-foreground hover:bg-primary/10 rounded-md transition-colors"
                            title="Create new resume"
                          >
                            <IconPlus className="h-4 w-4" />
                          </button>
                        </form>
                      </SidebarMenuSubItem>
                    </>
                  ) : (
                    <>
                      <SidebarMenuSubItem>
                        <div className="px-2 py-1 text-sm text-muted-foreground">
                          No Resumes Found
                        </div>
                      </SidebarMenuSubItem>

                      {/* Add New Resume Button when no resumes exist */}
                      <SidebarMenuSubItem className="ml-6">
                        <form onSubmit={onSubmit}>
                          <button
                            type="submit"
                            className="flex items-center justify-start pl-2 pr-2 py-1 min-h-8 text-foreground hover:bg-primary/10 rounded-md transition-colors"
                            title="Create new resume"
                          >
                            <IconPlus className="h-4 w-4" />
                          </button>
                        </form>
                      </SidebarMenuSubItem>
                    </>
                  )}
                </SidebarMenuSub>
              </div>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
