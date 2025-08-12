import { redirect } from 'next/navigation'
import { SITE_IS_LIVE } from '@/lib/site-status'
import MainHomePage from './main-home-page'

export default function HomePage() {
  // Server-side redirect - no client-side routing issues
  if (!SITE_IS_LIVE) {
    redirect('/coming-soon')
  }

  // Show main site content if live
  return <MainHomePage />
}
