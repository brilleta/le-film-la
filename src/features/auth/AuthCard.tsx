import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { pageItemVariants } from '@/lib/motion'

interface AuthCardProps {
  title: string
  description: string
  footer: ReactNode
  children: ReactNode
}

export function AuthCard({ title, description, footer, children }: AuthCardProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <motion.div variants={pageItemVariants} className="glass w-full max-w-sm rounded-2xl">
        <Card className="bg-transparent py-6 ring-0 [--card-spacing:--spacing(6)]">
          <CardHeader>
            <CardTitle className="font-heading text-2xl font-bold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
          <CardFooter className="justify-center bg-transparent text-muted-foreground">{footer}</CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {message}
    </p>
  )
}
