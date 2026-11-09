import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { pageItemVariants } from '@/lib/motion'

export const Route = createFileRoute('/_authenticated/account')({
  component: AccountPage,
})

function AccountPage() {
  const { user } = Route.useRouteContext()

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <motion.h1 variants={pageItemVariants} className="font-heading text-3xl font-bold tracking-tight">
        Mon compte
      </motion.h1>
      <motion.dl variants={pageItemVariants} className="glass grid gap-4 rounded-2xl p-6 text-sm">
        <div className="grid gap-1">
          <dt className="text-muted-foreground">Pseudo</dt>
          <dd className="text-base font-medium">{user.username}</dd>
        </div>
        <div className="grid gap-1">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="text-base font-medium">{user.email}</dd>
        </div>
      </motion.dl>
    </div>
  )
}
