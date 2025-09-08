'use server'
import { createClient } from '@/utils/supabase/client'
import { AppSidebar } from './app-sidebar';


export async function AppSidebarWrapper(): Promise<any> {
  
const supabase = createClient();
 const { data, error } = await supabase.functions.invoke('restful-api/cv',
    {method: 'GET'}
 )

  console.log("Cvs", data);
  return (
    <>
      <AppSidebar cvs={data}/>
    </>
);
}