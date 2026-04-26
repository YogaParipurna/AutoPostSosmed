import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.LINKEDIN_CLIENT_ID
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/linkedin/callback`
  const state = Math.random().toString(36).substring(7) // In production, save this to session to verify

  const linkedinAuthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization')
  linkedinAuthUrl.searchParams.append('response_type', 'code')
  linkedinAuthUrl.searchParams.append('client_id', clientId || '')
  linkedinAuthUrl.searchParams.append('redirect_uri', redirectUri)
  linkedinAuthUrl.searchParams.append('state', state)
  linkedinAuthUrl.searchParams.append('scope', 'w_member_social profile openid email')

  return NextResponse.redirect(linkedinAuthUrl.toString())
}
