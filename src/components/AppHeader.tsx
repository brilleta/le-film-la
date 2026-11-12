import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from '@tanstack/react-router'
import { Activity, ChevronDown, LogOut, ShieldCheck, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { pendingCountOptions } from '@/features/admin/adminQueries'
import { currentUserOptions, useLogout } from '@/features/auth/authQueries'
import type { User } from '@/features/auth/types'

export function AppHeader() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-end px-4">
        <AuthSlot />
      </div>
    </header>
  )
}

function AuthSlot() {
  const { data: user, isPending } = useQuery(currentUserOptions())

  // Pendant la vérification de la session : un emplacement neutre, ni bouton ni menu.
  if (isPending) return <Skeleton className="h-8 w-28 rounded-lg" aria-hidden="true" />
  return user ? <UserMenu user={user} /> : <LoginButton />
}

function LoginButton() {
  const { pathname, href } = useLocation()
  if (pathname === '/login' || pathname === '/register') return null

  return (
    <Button asChild variant="outline" size="sm" className="glass">
      <Link to="/login" search={{ redirect: pathname === '/' && href === '/' ? undefined : href }}>
        Se connecter
      </Link>
    </Button>
  )
}

function UserMenu({ user }: { user: User }) {
  const logout = useLogout()
  const isAdmin = user.role === 'ADMIN'
  const { data: pendingCount = 0 } = useQuery({ ...pendingCountOptions(), enabled: isAdmin })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="glass relative max-w-48">
          <UserRound aria-hidden="true" />
          <span className="truncate">{user.username}</span>
          <ChevronDown aria-hidden="true" />
          {pendingCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary ring-2 ring-background" aria-hidden="true" />
              <span className="sr-only">, {pendingCount} demandes d'accès en attente</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/account">
            <UserRound aria-hidden="true" />
            Mon compte
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" search={{ status: 'PENDING', q: '', page: 0 }}>
              <ShieldCheck aria-hidden="true" />
              Administration
              {pendingCount > 0 && (
                <Badge className="ml-auto h-4.5 min-w-4.5 px-1 text-[0.7rem]" aria-label={`${pendingCount} en attente`}>
                  {pendingCount}
                </Badge>
              )}
            </Link>
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin/stats" search={{ minutes: 15 }}>
              <Activity aria-hidden="true" />
              Statistiques en direct
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem disabled={logout.isPending} onSelect={() => logout.mutate()}>
          <LogOut aria-hidden="true" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
