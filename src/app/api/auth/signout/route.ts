import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function POST() {
  const supabase = createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return redirect('/dashboard')
  }

  return redirect('/login')
}
