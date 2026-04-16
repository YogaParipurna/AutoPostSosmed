import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { LayoutDashboard, PenSquare, Clock, CheckCircle, Settings, LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex text-foreground">
      {/* Sidebar */}
      <aside className="w-64 glass border-r flex flex-col fixed inset-y-0 z-10">
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
            AutomateIn
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium">
            <LayoutDashboard size={20} className="text-gray-500" />
            Overview
          </Link>
          <Link href="/dashboard/editor" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium">
            <PenSquare size={20} className="text-gray-500" />
            Create Post
          </Link>
          <Link href="/dashboard/posts?status=draft" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium">
            <Clock size={20} className="text-gray-500" />
            Drafts & Scheduled
          </Link>
          <Link href="/dashboard/posts?status=published" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium">
            <CheckCircle size={20} className="text-gray-500" />
            Published
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-sm font-medium">
            <Settings size={20} className="text-gray-500" />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold uppercase text-sm">
              {user.email?.charAt(0)}
            </div>
            <div className="text-sm font-medium truncate max-w-[120px]">{user.email}</div>
          </div>
          <form action="/api/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium">
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 animate-fade-in relative z-0">
        {children}
      </main>
    </div>
  )
}
