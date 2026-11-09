import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from '@tanstack/react-router'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="glass max-w-48">
          <UserRound aria-hidden="true" />
          <span className="truncate">{user.username}</span>
          <ChevronDown aria-hidden="true" />
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
        <DropdownMenuItem disabled={logout.isPending} onSelect={() => logout.mutate()}>
          <LogOut aria-hidden="true" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
