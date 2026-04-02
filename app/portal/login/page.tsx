// app/portal/login/page.tsx — Login page wrapper with Suspense
import { Suspense } from 'react'
import LoginForm from './LoginForm'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-cosmic-light flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-cosmic-brand animate-spin" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    )
}
