import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, BarChart3, Clock, CheckCircle2 } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch quick stats
  // In a real scenario we'd do aggregation queries
  const { count: draftCount } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft')
  const { count: scheduledCount } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'scheduled')
  const { count: publishedCount } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published')

  // Check if LinkedIn is connected
  const { data: accounts } = await supabase.from('social_accounts').select('id').eq('user_id', user?.id).limit(1)
  const isLinkedInConnected = accounts && accounts.length > 0

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Welcome to your AutomateIn workspace.</p>
        </div>
        <Link href="/dashboard/editor" className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary-500/20 flex items-center gap-2">
          <Plus size={18} />
          New Post
        </Link>
      </header>

      {!isLinkedInConnected && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-2xl flex items-start sm:items-center flex-col sm:flex-row justify-between gap-4">
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-500 text-lg">Connect your LinkedIn Account</h3>
            <p className="text-yellow-700 dark:text-yellow-400/80 text-sm mt-1">You need to connect your LinkedIn account to start scheduling and publishing posts.</p>
          </div>
          <Link href="/dashboard/settings" className="bg-yellow-500 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-yellow-600 transition-colors whitespace-nowrap">
            Connect Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="glass-card p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Drafts</span>
            <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
              <BarChart3 size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold">{draftCount || 0}</div>
        </div>

        {/* Stat Card 2 */}
        <div className="glass-card p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Scheduled</span>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold">{scheduledCount || 0}</div>
        </div>

        {/* Stat Card 3 */}
        <div className="glass-card p-6 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Published</span>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-bold">{publishedCount || 0}</div>
        </div>
      </div>

      <div className="glass-card p-8 min-h-[300px] flex items-center justify-center border-dashed border-2 bg-transparent text-gray-400">
        <div className="text-center">
          <p className="mb-4">Ready to reach your audience?</p>
          <Link href="/dashboard/editor" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">
            Write your first post ➔
          </Link>
        </div>
      </div>
    </div>
  )
}
