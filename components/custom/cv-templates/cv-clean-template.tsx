// This component MUST be a client component to perform DOM measurements.
'use client'

import React from 'react'
import type { ReactNode } from 'react'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { CvData } from '@/schemas/cv_data_schema'
// import { formatDate } from "@/utils/date-formatting";
import {
  isValidUrl,
  getLinkedInUsername,
  getXingUsername,
} from '@/utils/cv-utils'
import {
  IconGlobe,
  IconMail,
  IconPhone,
  IconBrandLinkedin,
  IconBrandXing,
} from '@tabler/icons-react'

// --- Types ---

interface CVCleanTemplateProps {
  cvData: CvData
  accentColor?: string
}

// --- Layout Constants ---
const A4_PAGE_HEIGHT_PX = 1123
const PAGE_PADDING_PX = 40
const PAGE_PADDING_Y_PX = PAGE_PADDING_PX * 2
const USABLE_PAGE_HEIGHT_SUBSEQUENT = A4_PAGE_HEIGHT_PX - PAGE_PADDING_Y_PX

// --- Visual Page Component ---
function Page({ children }: { children: ReactNode }) {
  return (
    <div
      className="bg-white shadow-lg mb-8 mx-auto overflow-hidden relative"
      style={{
        width: '794px',
        height: `${A4_PAGE_HEIGHT_PX}px`,
        padding: `${PAGE_PADDING_PX}px`,
        fontSize: '11px',
        lineHeight: '1.3',
      }}
    >
      {children}
    </div>
  )
}

// --- Main Template Component with Pagination Logic ---
export function CVCleanTemplate({
  cvData,
  accentColor = 'text-blue-600',
}: CVCleanTemplateProps) {
  const [paginatedPages, setPaginatedPages] = useState<ReactNode[]>([])
  const [isCalculating, setIsCalculating] = useState(true)

  // State to hold the final, balanced layout
  const [balancedLayout, setBalancedLayout] = useState<{
    left: ReactNode[]
    right: ReactNode[]
  } | null>(null)

  // Refs for measurement containers
  const headerRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  // STEP 1: Balance the columns based on initial measurements.
  useEffect(() => {
    // This effect runs once to decide if Education should be moved.
    const timer = setTimeout(() => {
      const headerEl = headerRef.current
      const leftEl = leftColRef.current
      const rightEl = rightColRef.current

      if (!headerEl || !leftEl || !rightEl) {
        setIsCalculating(false)
        return
      }

      const getBlockHeight = (block: HTMLElement) => {
        const style = window.getComputedStyle(block)
        return (
          block.offsetHeight +
          parseInt(style.marginTop, 10) +
          parseInt(style.marginBottom, 10)
        )
      }

      const headerHeight = getBlockHeight(headerEl)
      const usableHeightPage1 =
        A4_PAGE_HEIGHT_PX - headerHeight - PAGE_PADDING_Y_PX

      const leftBlocks = Array.from(leftEl.children) as HTMLElement[]
      const rightBlocks = Array.from(rightEl.children) as HTMLElement[]

      const educationBlock = leftBlocks.find(
        (el) => el.getAttribute('data-section') === 'education',
      )
      const leftFixedHeight = leftBlocks
        .filter((el) => el.getAttribute('data-section') !== 'education')
        .reduce((sum, block) => sum + getBlockHeight(block), 0)
      const educationHeight = educationBlock
        ? getBlockHeight(educationBlock)
        : 0
      const rightHeight = rightBlocks.reduce(
        (sum, block) => sum + getBlockHeight(block),
        0,
      )

      let finalLeftJsx: ReactNode[] = []
      const finalRightJsx: ReactNode[] = CVColumnRight({ cvData, accentColor })

      const shouldMoveEducation =
        educationHeight > 0 &&
        leftFixedHeight + educationHeight > usableHeightPage1 &&
        rightHeight + educationHeight <= usableHeightPage1

      if (shouldMoveEducation) {
        finalLeftJsx = CVColumnLeftFixed({ cvData, accentColor })
        finalRightJsx.push(...CVColumnEducation({ cvData, accentColor }))
      } else {
        finalLeftJsx = CVColumnLeft({ cvData, accentColor })
      }

      setBalancedLayout({ left: finalLeftJsx, right: finalRightJsx })
    }, 50) // A small delay to ensure DOM is ready for measurement.

    return () => clearTimeout(timer)
  }, [cvData, accentColor])

  // STEP 2: Paginate the final, balanced layout.
  useEffect(() => {
    if (!balancedLayout) return

    // This effect runs after the balanced layout is determined.
    const timer = setTimeout(() => {
      const headerEl = headerRef.current
      const leftEl = leftColRef.current
      const rightEl = rightColRef.current
      if (!headerEl || !leftEl || !rightEl) {
        setIsCalculating(false)
        return
      }

      const getBlockHeight = (block: HTMLElement) => {
        const style = window.getComputedStyle(block)
        return (
          block.offsetHeight +
          parseInt(style.marginTop, 10) +
          parseInt(style.marginBottom, 10)
        )
      }

      const headerHeight = getBlockHeight(headerEl)
      const usableHeightPage1 =
        A4_PAGE_HEIGHT_PX - headerHeight - PAGE_PADDING_Y_PX

      const paginateColumn = (
        container: HTMLElement,
        originalJsx: ReactNode[],
      ) => {
        const pages: ReactNode[][] = []
        if (!container || originalJsx.length === 0) return pages

        const blocks = Array.from(container.children) as HTMLElement[]
        let currentPage: ReactNode[] = []
        let currentPageHeight = 0
        let isFirstPage = true

        blocks.forEach((block, index) => {
          const blockHeight = getBlockHeight(block)
          const usableHeight = isFirstPage
            ? usableHeightPage1
            : USABLE_PAGE_HEIGHT_SUBSEQUENT
          if (
            currentPageHeight + blockHeight > usableHeight &&
            currentPage.length > 0
          ) {
            pages.push(currentPage)
            currentPage = [originalJsx[index]]
            currentPageHeight = blockHeight
            isFirstPage = false
          } else {
            currentPage.push(originalJsx[index])
            currentPageHeight += blockHeight
          }
        })
        if (currentPage.length > 0) pages.push(currentPage)
        return pages
      }

      const paginatedLeft = paginateColumn(leftEl, balancedLayout.left)
      const paginatedRight = paginateColumn(rightEl, balancedLayout.right)

      const numPages = Math.max(paginatedLeft.length, paginatedRight.length)
      const finalPages = []

      for (let i = 0; i < numPages; i++) {
        finalPages.push(
          <Page key={i}>
            {i === 0 && <CVHeader cvData={cvData} />}
            <div className="grid grid-cols-[250px_1fr] gap-x-12">
              <div>{paginatedLeft[i] || []}</div>
              <div>{paginatedRight[i] || []}</div>
            </div>
          </Page>,
        )
      }
      setPaginatedPages(finalPages)
      setIsCalculating(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [balancedLayout, cvData])

  return (
    <div>
      {/* 1. Hidden Renderer for Measurement - Renders based on the balanced layout */}
      <div
        className="absolute opacity-0 -z-10 w-[794px]"
        style={{ padding: `0 ${PAGE_PADDING_PX}px` }}
      >
        <div ref={headerRef}>
          <CVHeader cvData={cvData} isMeasurement />
        </div>
        <div className="grid grid-cols-[250px_1fr] gap-x-12">
          <div ref={leftColRef}>
            {balancedLayout
              ? balancedLayout.left
              : CVColumnLeft({ cvData, accentColor })}
          </div>
          <div ref={rightColRef}>
            {balancedLayout
              ? balancedLayout.right
              : CVColumnRight({ cvData, accentColor })}
          </div>
        </div>
      </div>

      {/* 2. Visible Renderer */}
      {isCalculating ? (
        <Page>
          <div>Calculating layout...</div>
        </Page>
      ) : (
        paginatedPages
      )}
    </div>
  )
}

// --- Sub-Components for Content ---
function CVHeader({
  cvData,
  isMeasurement = false,
}: CVCleanTemplateProps & { isMeasurement?: boolean }) {
  const paddingClass = isMeasurement ? `pt-8 pb-4` : ``
  const hasImage =
    cvData.personalInformation?.profileUrl &&
    isValidUrl(cvData.personalInformation.profileUrl)
  return (
    <div className={`flex items-start justify-between ${paddingClass}`}>
      <div className="flex-1 pr-8">
        <h1 className="text-3xl font-bold text-black mb-1 leading-tight">
          {cvData.personalInformation?.name}{' '}
          {cvData.personalInformation?.surname}
        </h1>
        <h2 className="text-lg text-gray-700 font-normal mb-4 leading-tight">
          {cvData.personalInformation?.professionalTitle}
        </h2>
        {cvData.personalInformation?.summary && (
          <p
            className={`text-sm text-gray-800 mb-6 ${
              hasImage ? 'max-w-md' : 'max-w-full'
            }`}
            style={{ lineHeight: '1.5' }}
          >
            {cvData.personalInformation?.summary}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        {hasImage && cvData.personalInformation && (
          <Image
            src={cvData.personalInformation.profileUrl!}
            alt={`${cvData.personalInformation.name} ${cvData.personalInformation.surname}`}
            width={130}
            height={130}
            className="w-[130px] h-[130px] rounded-full object-cover"
          />
        )}
      </div>
    </div>
  )
}

function CVColumnLeftFixed({
  cvData,
  accentColor,
}: CVCleanTemplateProps): ReactNode[] {
  const sections: ReactNode[] = []
  sections.push(
    <div key="contact" className="mb-6" data-section="contact">
      <div className="space-y-2 text-xs">
        {cvData.personalInformation?.email && (
          <a
            href={`mailto:${cvData.personalInformation.email}`}
            className="flex items-center gap-2"
          >
            <IconMail size={14} className="text-gray-500" />
            <span>{cvData.personalInformation.email}</span>
          </a>
        )}
        {cvData.personalInformation?.phone && (
          <a
            href={`tel:${cvData.personalInformation.phone}`}
            className="flex items-center gap-2"
          >
            <IconPhone size={14} className="text-gray-500" />
            <span>{cvData.personalInformation.phone}</span>
          </a>
        )}
        {cvData.personalInformation?.website && (
          <a
            href={cvData.personalInformation.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <IconGlobe size={14} className="text-gray-500" />
            <span>
              {cvData.personalInformation.website.replace('https://', '')}
            </span>
          </a>
        )}
        {cvData.personalInformation?.linkedin && (
          <a
            href={cvData.personalInformation.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <IconBrandLinkedin size={14} className="text-gray-500" />
            <span>
              {getLinkedInUsername(cvData.personalInformation.linkedin)}
            </span>
          </a>
        )}
        {cvData.personalInformation?.xing && (
          <a
            href={cvData.personalInformation.xing}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <IconBrandXing size={14} className="text-gray-500" />
            <span>{getXingUsername(cvData.personalInformation.xing)}</span>
          </a>
        )}
      </div>
    </div>,
  )
  cvData.skillGroups?.forEach((skillGroup, groupIndex) => {
    sections.push(
      <div
        key={`skill-group-${groupIndex}`}
        className="mb-6"
        data-section="skill"
      >
        <h3 className={`text-sm font-bold ${accentColor} tracking-wide mb-1.5`}>
          {skillGroup.name}
        </h3>
        <div className="text-xs text-gray-800 space-y-1">
          {skillGroup.skills?.map((skill, skillIndex) => (
            <p key={skillIndex}>{skill.name}</p>
          ))}
        </div>
      </div>,
    )
  })
  return sections
}

function CVColumnEducation({
  cvData,
  accentColor,
}: CVCleanTemplateProps): ReactNode[] {
  if (!cvData.education || cvData.education.length === 0) return []
  return [
    <div key="education" className="mb-6" data-section="education">
      <h3 className={`text-sm font-bold ${accentColor} tracking-wide mb-1.5`}>
        Education
      </h3>
      <div className="space-y-4">
        {cvData.education.map((edu, index) => (
          <div key={index} className="text-xs">
            <p className="font-semibold text-black mb-1">{edu.degree}</p>
            <p className="text-gray-800">{edu.institution}</p>
            <p className="text-gray-500 mt-1">
              {edu?.startDate &&
                new Date(edu?.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                })}{' '}
              -{' '}
              {edu.currentlyStudyingHere
                ? 'Present'
                : edu.endDate
                ? new Date(edu.endDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })
                : 'Present'}{' '}
              • {edu.location}
            </p>
            {edu.description && (
              <p className="text-gray-800 mt-1">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>,
  ]
}

// Helper to get all left column content combined
function CVColumnLeft({
  cvData,
  accentColor,
}: CVCleanTemplateProps): ReactNode[] {
  return [
    ...CVColumnLeftFixed({ cvData, accentColor }),
    ...CVColumnEducation({ cvData, accentColor }),
  ]
}

function CVColumnRight({
  cvData,
  accentColor,
}: CVCleanTemplateProps): ReactNode[] {
  const sections: ReactNode[] = []
  if (cvData.experience && cvData.experience.length > 0) {
    sections.push(
      <div key="experience" className="mb-6" data-section="experience">
        <h3 className={`text-sm font-bold ${accentColor} tracking-wide mb-1.5`}>
          Experience
        </h3>
        <div className="space-y-5 text-xs">
          {cvData.experience?.map((work, index) => (
            <div key={index}>
              <p className="font-semibold text-black mb-1">{work.role}</p>
              <p className=" text-gray-800 mb-1">{work.company}</p>
              <p className="text-xs text-gray-500 mb-2">
                {work.startDate &&
                  new Date(work.startDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}{' '}
                -{' '}
                {work.currentlyWorkingHere
                  ? 'Present'
                  : work.endDate
                  ? new Date(work.endDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })
                  : 'Present'}{' '}
                • {work.location}
              </p>
              <div
                className="text-xs text-gray-800"
                style={{ lineHeight: '1.5' }}
              >
                {work.description}
              </div>
            </div>
          ))}
        </div>
      </div>,
    )
  }
  return sections
}
