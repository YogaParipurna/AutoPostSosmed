import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use anon/service role key because cron runs without user session
    const supabaseUrls = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    if(!supabaseUrls || !supabaseServiceKey) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const supabase = createClient(supabaseUrls, supabaseServiceKey)

    // Fetch scheduled posts that are due
    const { data: duePosts, error } = await supabase
      .from('posts')
      .select('id, user_id, content, first_comment')
      .eq('status', 'scheduled')
      .lte('scheduled_at', new Date().toISOString())

    if (error) throw error

    if (!duePosts || duePosts.length === 0) {
      return NextResponse.json({ message: 'No posts scheduled to publish' })
    }

    for (const post of duePosts) {
      // Fetch LinkedIn access token
      const { data: account } = await supabase
        .from('social_accounts')
        .select('access_token')
        .eq('user_id', post.user_id)
        .eq('provider', 'linkedin')
        .single()

      if (!account?.access_token) {
        console.error(`No LinkedIn account found for user ${post.user_id}`)
        continue
      }

      try {
        // LinkedIn API call for UGC POST goes here
        // We simulate the fetch for this boilerplate
        console.log(`Publishing post ${post.id} for user ${post.user_id} via LinkedIn API...`)
        
        // Example: 
        // await fetch('https://api.linkedin.com/v2/ugcPosts', {
        //   method: 'POST',
        //   headers: { 'Authorization': `Bearer ${account.access_token}`, ... },
        //   body: JSON.stringify({...})
        // })

        // Mark as published
        await supabase
          .from('posts')
          .update({ status: 'published', published_at: new Date().toISOString() })
          .eq('id', post.id)

      } catch (err) {
        console.error(`Failed to publish post ${post.id}`, err)
      }
    }

    return NextResponse.json({ message: `Successfully processed ${duePosts.length} posts` })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
