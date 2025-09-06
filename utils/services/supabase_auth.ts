import { createClient } from "../supabase/client";

const supabase = await createClient()

async function sign_in_with_email(data: {email: string, password: string}) {
    const { error } = await supabase.auth.signInWithPassword(data)
    console.log(error);
}
    