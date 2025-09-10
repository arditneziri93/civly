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

    const { data, error } = await supabase.functions.invoke('restful-api/cv', {method: 'GET'})
    console.log("cvs:",data);
    if (error) {
      return <AppSidebar cvs={[]} />
    }

    return <AppSidebar cvs={data.data} />
  } catch {
    return <AppSidebar cvs={[]} />
  }
}
