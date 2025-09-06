'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';
import { forgotPasswordSchema, FormState } from '../validation/auth';

export async function forgotPasswordAction(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = await createClient()

  const fields = {
    email: formData.get('email') as string
  };

  const validatedFields = forgotPasswordSchema.safeParse(fields);

  if(!validatedFields.success){
    return { 
      success: false,
      message: 'Validation failed. Failed to reset Password.',
      zodErrors: validatedFields.error.flatten().fieldErrors,
      data: {
        ...prevState.data,
        ...fields
      }
    }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(validatedFields.data.email);

  if (error) {
    console.log(error);
    return {
      success: false,
      message: 'Reset Password failed',
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
    message: 'Reset Password successful',
    backendErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...fields
    }
  }
}