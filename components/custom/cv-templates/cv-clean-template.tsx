import React from 'react'
import Image from 'next/image'
import { CVData } from '@/types/cv-data'
import { formatDate } from '@/utils/date-formatting'
import {
  IconGlobe,
  IconMail,
  IconPhone,
  IconBrandLinkedin,
  IconBrandXing,
} from '@tabler/icons-react'

interface CVCleanTemplateProps {
  cvData: CVData
  accentColor?: string
}

// Helper functions to extract usernames from social URLs
const getLinkedInUsername = (url: string): string => {
  const match = url.match(/linkedin\.com\/in\/([^\/]+)/)
  return match ? match[1] : 'LinkedIn'
}

const getXingUsername = (url: string): string => {
  const match = url.match(/xing\.com\/profile\/([^\/]+)/)
  return match ? match[1] : 'Xing'
}

export function CVCleanTemplate({
  cvData,
  accentColor = 'text-blue-600',
}: CVCleanTemplateProps) {
  return (
    <div
      className="w-[794px] h-[1123px] bg-white shadow-lg mx-auto relative overflow-hidden print:shadow-none"
      style={{ fontSize: '11px', lineHeight: '1.3' }}
    >
      {/* Header Section */}
      <div className="flex items-start justify-between px-12 pt-12 pb-4">
        {/* Left side - Name and Title */}
        <div className="flex-1 pr-8">
          <h1 className="text-3xl font-bold text-black mb-1 leading-tight">
            {cvData.personalInformation?.name}{' '}
            {cvData.personalInformation?.surname}
          </h1>
          {cvData.personalInformation?.professionalTitle && (
            <h2 className="text-lg text-black font-normal mb-4 leading-tight">
              {cvData.personalInformation?.professionalTitle}
            </h2>
          )}

          {/* Summary */}
          {cvData.personalInformation?.summary && (
            <p
              className="text-sm text-gray-600 font-semibold max-w-lg"
              style={{ lineHeight: '1.5' }}
            >
              {cvData.personalInformation?.summary}
            </p>
          )}
        </div>

        {/* Right side - Photo */}
        <div className="flex-shrink-0 ">
          {cvData.personalInformation?.profile_url && (
            <Image
              src={cvData.personalInformation.profile_url}
              alt={`${cvData.personalInformation.name} ${cvData.personalInformation.surname}`}
              width={130}
              height={130}
              className="w-[130px] h-[130px] rounded-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div
        className="grid grid-cols-[300px_1fr] gap-8 px-12 py-8"
        style={{ lineHeight: '1.3' }}
      >
        {/* Left Column */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div>
            <div
              className="space-y-2 text-sm text-gray-600"
              style={{ lineHeight: '1.4' }}
            >
              {cvData.personalInformation?.email && (
                <a
                  href={`mailto:${cvData.personalInformation.email}`}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <IconMail className="w-3 h-3" />
                  <span>{cvData.personalInformation.email}</span>
                </a>
              )}
              {cvData.personalInformation?.phone && (
                <a
                  href={`tel:${cvData.personalInformation.phone}`}
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <IconPhone className="w-3 h-3" />
                  <span>{cvData.personalInformation.phone}</span>
                </a>
              )}
              {cvData.personalInformation?.website && (
                <a
                  href={cvData.personalInformation.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <IconGlobe className="w-3 h-3" />
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
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <IconBrandLinkedin className="w-3 h-3" />
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
                  className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <IconBrandXing className="w-3 h-3" />
                  <span>
                    {getXingUsername(cvData.personalInformation.xing)}
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Education */}
          <div>
            <h3 className={`text-base font-semibold ${accentColor} mb-2`}>
              Education
            </h3>
            <div className="space-y-3">
              {cvData.education?.map((edu, index) => (
                <div
                  key={index}
                  className="text-xs"
                  style={{ lineHeight: '1.3' }}
                >
                  <div className="font-semibold text-black mb-0.5">
                    {edu.degree}
                  </div>
                  <div className="text-black mb-1">{edu.institution}</div>
                  <div className="text-gray-500 font-medium">
                    {edu?.startDate && formatDate(edu?.startDate)} - {edu.endDate && formatDate(edu.endDate)}
                    {edu.location && ` • ${edu.location}`}
                  </div>
                  {edu.description && (
                    <div className="text-gray-600 mt-1">{edu.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Groups */}
          {cvData.skillGroups && cvData.skillGroups
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((skillGroup, groupIndex) => (
              <div key={groupIndex}>
                <h3 className={`text-base font-semibold ${accentColor} mb-2`}>
                  {skillGroup.name}
                </h3>
                <div className="space-y-1">
                  {skillGroup.skills && skillGroup.skills
                    .sort((a, b) => a.order && b.order ? a.order - b.order: 0 )
                    .map((skill, skillIndex) => (
                      <div
                        key={skillIndex}
                        className="text-xs text-black"
                        style={{ lineHeight: '1.3' }}
                      >
                        {skill.name}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Work Experience */}
          <div>
            <h3 className={`text-base font-semibold ${accentColor} mb-2`}>
              Experience
            </h3>
            <div className="space-y-5">
              {cvData.experience && cvData.experience.map((work, index) => (
                <div key={index}>
                  <div className="mb-2">
                    {/* Role - more emphasis */}
                    <h4
                      className="text-sm font-bold text-black mb-0.5"
                      style={{ lineHeight: '1.2' }}
                    >
                      {work.role}
                    </h4>
                    {/* Company - secondary */}
                    <div
                      className="text-sm font-medium text-gray-700 mb-1"
                      style={{ lineHeight: '1.3' }}
                    >
                      {work.company}
                    </div>
                    {/* Date and location */}
                    <div
                      className="text-xs text-gray-500 font-medium"
                      style={{ lineHeight: '1.3' }}
                    >
                      {work.startDate && formatDate(work.startDate)} - {work.endDate && formatDate(work.endDate)}
                      {work.location && ` | ${work.location}`}
                    </div>
                  </div>
                  {/* Description as continuous text */}
                  {work.description && (
                    <div
                      className="text-xs text-black"
                      style={{ lineHeight: '1.5' }}
                    >
                      {work.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
