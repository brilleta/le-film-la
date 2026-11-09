import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import { MotionConfig } from 'motion/react'
import { AppHeader } from '@/components/AppHeader'
import { Footer } from '@/components/Footer'
import { NotFound } from '@/components/NotFound'
import { PageTransition } from '@/components/PageTransition'
import { Toaster } from '@/components/ui/sonner'
import type { AuthContext } from '@/features/auth/types'
import { defaultTransition } from '@/lib/motion'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient; auth: AuthContext }>()({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <MotionConfig reducedMotion="user" transition={defaultTransition}>
      <div className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
        >
          Aller au contenu
        </a>
        <AppHeader />
        <main id="main" className="flex flex-1 flex-col">
          <PageTransition />
        </main>
        <Footer />
        <Toaster theme="dark" position="bottom-center" />
      </div>
    </MotionConfig>
  )
}
