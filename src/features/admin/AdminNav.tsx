import { Link } from '@tanstack/react-router'
import { Activity, Users } from 'lucide-react'

const linkClass =
  'inline-flex h-8 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-[status=active]:bg-white/10 data-[status=active]:text-foreground [&_svg]:size-4'

/** Bascule entre les pages d'administration (TanStack Router pose `data-status="active"` sur le lien courant). */
export function AdminNav() {
  return (
    <nav aria-label="Administration" className="glass inline-flex w-fit gap-1 rounded-xl p-1">
      <Link to="/admin" search={{ status: 'PENDING', q: '', page: 0 }} className={linkClass}>
        <Users aria-hidden="true" />
        Utilisateurs
      </Link>
      <Link to="/admin/stats" search={{ minutes: 15 }} className={linkClass}>
        <Activity aria-hidden="true" />
        Statistiques
      </Link>
    </nav>
  )
}
