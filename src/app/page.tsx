import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <div className="glass-card p-12 max-w-3xl animate-slide-up">
        <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 mb-6 pb-2">
          AutomateIn
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-xl mx-auto">
          The premium single-user studio to draft, generate, and schedule LinkedIn posts with AI. Maintain your professional presence effortlessly.
        </p>
        <Link 
          href="/login" 
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium px-8 py-4 rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-1"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
