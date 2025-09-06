'use server'

import { createClient } from '@/utils/supabase/server';
import { FormState, loginSchema } from '../validation/auth';

export async function loginAction(prevState: FormState, formData: FormData): Promise<FormState> {
  
  const fields = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string
  };

  const validatedFields = loginSchema.safeParse(fields);

  if(!validatedFields.success){
    return { 
      success: false,
      message: 'Validation failed. Failed to login.',
      zodErrors: validatedFields.error.flatten().fieldErrors,
      data: {
        ...prevState.data,
        ...fields
      }
    }
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(validatedFields.data);

  if(error){
    console.log(error); 
    return {
      success: false,
      message: 'Login failed',
      backendErrors: error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields
      }
    }
  } 
  
  return {
    success: true,
    message: 'Login successful',
    backendErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields
    }
  }
}
