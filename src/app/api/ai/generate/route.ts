import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt, type } = await req.json()

    let systemPrompt = 'You are a professional LinkedIn post creator. Write engaging, professional content suited for LinkedIn.'

    if (type === 'rewrite') {
      systemPrompt = 'You are a skilled editor. Rewrite the provided text to be more engaging and professional for LinkedIn.'
    } else if (type === 'hashtags') {
      systemPrompt = 'Generate 5 highly relevant LinkedIn hashtags for the provided text. Return ONLY the hashtags separated by spaces.'
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'gpt-4o', // using a fast standard model
    })

    return NextResponse.json({ result: completion.choices[0].message.content })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
