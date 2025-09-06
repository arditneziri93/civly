'use server'

import { createClient } from '@/utils/supabase/server';
import { FormState, signUpSchema } from '../validation/auth';

export async function signUpAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const fields = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string
  };
  const validatedFields = signUpSchema.safeParse(fields);

  if(!validatedFields.success){
    return { 
      success: false,
      message: 'Validation failed. Failed to sign up.',
      zodErrors: validatedFields.error.flatten().fieldErrors,
      data: {
        ...prevState.data,
        ...fields
      }
    }
  }

  const data = {
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp(data);

  if (error) {
    console.log(error);
    return {
      success: false,
      message: 'User Sign up failed',
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
    message: 'User Sign up successful',
    backendErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields
    }
  }
}