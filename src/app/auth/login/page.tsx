import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Anmelden - OpenCarBox',
  description: 'Melde dich bei deinem OpenCarBox Konto an',
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Willkommen zurück
          </h1>
          <p className="text-sm text-muted-foreground">
            Gib deine Anmeldedaten ein, um fortzufahren
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}