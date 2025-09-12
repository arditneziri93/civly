'use server'

import { CivlyLogo } from "@/components/custom/civly-logo";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export default async function LogoutPage() {
    const supabase = await createClient()
      
      const { error } = await supabase.auth.signOut();
    
      if (error) {
        console.log(error);
        redirect('/error');
      }
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
          <div className="flex w-full max-w-sm flex-col gap-6">
            <a href="#" className="flex items-center gap-2 self-center font-medium">
              <CivlyLogo width={180} height={89} />
            </a>
            <div className="flex items-center gap-2 self-center font-medium">You have been logged out</div>
          </div>
        </div>
    )
}