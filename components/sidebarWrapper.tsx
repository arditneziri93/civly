'use server'
import { createClient } from '@/utils/supabase/server'
import { AppSidebar } from './app-sidebar'

export async function SidebarWrapper() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return <AppSidebar cvs={[]} />
    }

    const { data: cvs, error } = await supabase
      .from('cv')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return <AppSidebar cvs={[]} />
    }

    return <AppSidebar cvs={cvs || []} />
  } catch {
    return <AppSidebar cvs={[]} />
  }
}
