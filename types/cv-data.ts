export interface CVData {
  id: string
  last_modified?: Date | null
  created_at?: Date | null
  user_id?: string | null
  visibility?: 'draft' | 'private' | 'public' | null
  password?: string | null
  layout_configs?: LayoutConfigs | null
  personalInformation?: PersonalInformation | null
  experience?: ExperienceItem[] | null
  education?: EducationItem[] | null
  skillGroups?: SkillGroup[] | null
}

export interface LayoutConfigs {
  template_id?: number | null
  color_id?: number | null
  font_size?: number | null
}

export interface PersonalInformation {
  name?: string | null
  surname?: string | null
  profile_url?: string | null
  birthdate?: string | null
  email?: string | null
  phone?: string | null
  location?: string | null
  linkedin?: string | null
  xing?: string | null
  website?: string | null
  professionalTitle?: string | null
  summary?: string | null
}

export interface ExperienceItem {
  role?: string | null
  company?: string | null
  startDate?: Date | null
  currentlyWorkingHere?: boolean | null
  endDate?: Date | null
  location?: string | null
  description?: string | null
}

export interface EducationItem {
  degree?: string | null
  institution?: string | null
  startDate?: Date | null
  currentlyStudyingHere?: boolean | null
  endDate?: Date | null
  location?: string | null
  description?: string | null
}

export interface SkillGroup {
  id: string;
  name?: string | null
  order?: number | null
  skills?: Skill[] | null
}

export interface Skill {
  order?: number | null
  name?: string | null
}
