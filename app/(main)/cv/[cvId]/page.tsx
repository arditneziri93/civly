'use server'
import { CVCleanTemplate } from '@/components/custom/cv-templates/cv-clean-template'
import { CVData, EducationItem, ExperienceItem, LayoutConfigs, PersonalInformation, Skill, SkillGroup } from '@/types/cv-data';
import { createClient } from '@/utils/supabase/server';

class CV implements CVData {
    public id: string;
    public last_modified?: Date | null | undefined;
    public created_at?: Date | null | undefined;
    public user_id?: string | null | undefined;
    public visibility?: 'public' | 'draft' | 'private' | null | undefined;
    public password?: string | null | undefined;
    public layout_configs?: LayoutConfigs | null | undefined;
    public personalInformation?: PersonalInformation | null | undefined;
    public experience?: ExperienceItem[] | null | undefined;
    public education?: EducationItem[] | null | undefined;
    public skillGroups?: SkillGroup[] | null | undefined;
    
    constructor (id: string) {
        this.id = id;
    }
}

async function getCVBasedata(cvId: string): Promise<CV>{
  const supabase = await createClient();
  const { data, error } = await supabase
  .from('cv')
  .select(
    `
    id,
    visibility,
    layoutConfigs(
      template_id,
      color_id,
      font_size
    ),
    personalInformation(
      name,
      surname,
      profile_url,
      birthdate,
      email,
      phone,
      location,
      linkedin,
      website,
      xing,
      professionalTitle,
      summary
    )
    `,
  )
  .eq(
    'id',
    cvId,
  );
  console.log(data);
  const cv = new CV(cvId);
  if(data !== null){
    cv.visibility = data[0].visibility;
    cv.layout_configs = data[0].layoutConfigs[0];
    cv.personalInformation = data[0].personalInformation[0];
  }
  
  return cv;
}

async function getCVExData(cvId: string): Promise<ExperienceItem[] | null>{
  const supabase = await createClient();
  const { data, error } = await supabase
  .from('ExperienceItem')
  .select(
    `
    role,
    company,
    startDate,
    currentlyWorkingHere,
    endDate,
    location,
    description
    `,
  )
  .eq(
    'cv_id',
    cvId,
  )
  .order('startDate', { ascending: true })
  
  return data;
}

async function getCVEdData(cvId: string): Promise<EducationItem[] | null>{
  const supabase = await createClient();
  const { data, error } = await supabase
  .from('EducationItem')
  .select(
    `
    degree,
    institution,
    startDate,
    currentlyStudyingHere,
    endDate,
    location,
    description
    `,
  )
  .eq(
    'cv_id',
    cvId,
  )
  .order('startDate', { ascending: true })
  
  return data;
}

async function getCVSkillGroupData(cvId: string): Promise<SkillGroup[] | null>{
  const supabase = await createClient();
  const { data, error } = await supabase
  .from('SkillGroup')
  .select(
    `
    id,
    name,
    order
    `,
  )
  .eq(
    'cv_id',
    cvId,
  )
  .order('order', { ascending: true })
  
  return data;
}

async function getCVSkillsData(skillgroupId: string): Promise<Skill[] | null>{
  const supabase = await createClient();
  const { data, error } = await supabase
  .from('Skill')
  .select(
    `
    name,
    order
    `,
  )
  .eq(
    'skillgroup_id',
    skillgroupId,
  )
  .order('order', { ascending: true })
  
  return data;
}

async function getCV(cvId: string): Promise<CVData> {
    
    const base = await getCVBasedata(cvId);
    base.experience = await getCVExData(cvId);
    base.education = await getCVEdData(cvId);
    base.skillGroups = await getCVSkillGroupData(cvId);
    if(base.skillGroups !== null){
        let index = 0;
        for (const skillGroup of base.skillGroups) {
            const skill = await getCVSkillsData(skillGroup.id);
            base.skillGroups[index].skills = skill;
            index++;
        }
    }
    console.log(base);
    return base;
}

export default async function CVPage({
  params,
}: {
  params: Promise<{ cvId: string }>
}) {
  const { cvId } = await params;
  const mockCvData = await getCV(cvId);
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-5xl mx-auto">
         <CVCleanTemplate cvData={mockCvData} accentColor="text-blue-600" />
      </div>
    </div>
  )
}
