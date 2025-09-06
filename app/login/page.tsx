'use client'

import { LoginForm } from '@/components/login-form'
import { CivlyLogo } from '@/components/custom/civly-logo'
import { useActionState, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { FormSeparator } from '@/components/custom/auth-form/form-separator'
import { GoogleAuthButton } from '@/components/custom/auth-form/google-auth-button'
import { Button } from '@/components/ui/button'
import { forgotPasswordAction } from '@/utils/actions/forgotPassword'
import { FormState } from '@/utils/validation/auth'
import { signUpAction } from '@/utils/actions/signup'
import { loginAction } from '@/utils/actions/login'
import { ZodErrors } from '@/components/custom/auth-form/zod-errors'
import { NameField } from '@/components/custom/auth-form/fields/NameField'
import { EmailField } from '@/components/custom/auth-form/fields/EmailField'
import { redirect } from 'next/navigation'

enum AuthView {
  Login,
  Register,
  ForgotPassword,
}

export default function LoginPage() {
  //TODO: if already logged in redirect to Dashboard
  
  const [authView, setAuthView] = useState(AuthView.Login)
  const INITIAL_STATE: FormState = {
    success: false,
    message: undefined,
    backendErrors: null,
    zodErrors: null,
  };
  const [signUpFormState, signUpFormAction] = useActionState(
    signUpAction,
    INITIAL_STATE
  );
  const [forgotPasswordFormState, forgotPasswordFormAction] = useActionState(
    forgotPasswordAction,
    INITIAL_STATE
  );
  const [loginFormState, loginFormAction] = useActionState(
    loginAction,
    INITIAL_STATE
  );
  
  if(loginFormState?.success){
    redirect('/');
  }

  const handleAuthViewChange = (view: AuthView) => {
    setAuthView(view)
  }

  const SubmitButton = () => (
    <Button type="submit" className="w-full">
      Continue
    </Button>
  )

  const PasswordField = ({
    showForgotPassword,
  }: {
    showForgotPassword?: boolean
  }) => (
    <div className="grid gap-3">
      <div className="flex items-center">
        <Label htmlFor="password">Password</Label>
        {showForgotPassword && (
          <a
            onClick={() => handleAuthViewChange(AuthView.ForgotPassword)}
            className="ml-auto text-sm underline-offset-4 hover:underline cursor-pointer"
          >
            Forgot your password?
          </a>
        )}
      </div>
      <Input id="password" name="password" type="password" required />
    </div>
  )

  const ConfirmPasswordField = () => (
    <div className="grid gap-3">
      <Label htmlFor="password">Confirm Password</Label>
      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder=""
        required
      />
    </div>
  )

  const SwitchToRegisterButton = () => (
    <div className="text-center text-sm">
      Don&apos;t have an account?{' '}
      <a
        onClick={() => handleAuthViewChange(AuthView.Register)}
        className="underline underline-offset-4"
      >
        Sign up
      </a>
    </div>
  )

  const SwitchToLoginButton = () => (
    <div className="text-center text-sm">
      You already have an account?{' '}
      <a
        onClick={() => handleAuthViewChange(AuthView.Login)}
        className="underline underline-offset-4"
      >
        Sign in
      </a>
    </div>
)

  const renderFormChildren = () => {
    switch (authView) {
      case AuthView.Login:
        return (
          <>
            <form action={loginFormAction}>
              <div className="grid gap-6">
                <div className="text-pink-500 text-xs italic">{loginFormState?.message} {loginFormState?.backendErrors?.message}</div>
                <EmailField defaultName={loginFormState?.data?.email || ''} />
                <ZodErrors error={loginFormState?.zodErrors?.email} />
                <PasswordField showForgotPassword={true} />
                <ZodErrors error={loginFormState?.zodErrors?.password} />
                <SubmitButton />
                <FormSeparator />
                <GoogleAuthButton onClick={() => {}} />
                <SwitchToRegisterButton />
              </div>
            </form>
          </>
        )
      case AuthView.Register:
        return (
          <>
            <form action={signUpFormAction}>
              <div className="grid gap-6">
                <div className="text-pink-500 text-xs italic">{signUpFormState?.message} {loginFormState?.backendErrors?.message}</div>
                <NameField defaultName={signUpFormState?.data?.name || ''}/>
                <ZodErrors error={signUpFormState?.zodErrors?.name} />
                <EmailField defaultName={signUpFormState?.data?.email || ''}/>
                <ZodErrors error={signUpFormState?.zodErrors?.email} />
                <PasswordField showForgotPassword={false} />
                <ZodErrors error={signUpFormState?.zodErrors?.password} />
                <ConfirmPasswordField />
                <ZodErrors error={signUpFormState?.zodErrors?.confirmPassword} />
                <SubmitButton />
                <FormSeparator />
                <GoogleAuthButton onClick={() => {}} />
                <SwitchToLoginButton />
              </div>
            </form>
          </>
        )
      case AuthView.ForgotPassword:
        return (
          <>
            <form action={forgotPasswordFormAction}>
              <div className="grid gap-6">
                <div className="text-pink-500 text-xs italic">{forgotPasswordFormState?.message} {loginFormState?.backendErrors?.message}</div>
                <EmailField defaultName={forgotPasswordFormState?.data?.email || ''}/>
                <ZodErrors error={forgotPasswordFormState?.zodErrors?.email} />
                <SubmitButton />
                <SwitchToLoginButton />
              </div>
            </form>
          </>
        )
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <CivlyLogo width={180} height={89} />
        </a>
        <LoginForm>{renderFormChildren()}</LoginForm>
      </div>
    </div>
  )
}
