import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { ChevronLeft, ChevronRight, Search, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { EmptyState } from '@/components/EmptyState'
import { ErrorState } from '@/components/ErrorState'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { pageItemVariants } from '@/lib/motion'
import { adminUsersOptions, pendingCountOptions, useAiAccessAction } from './adminQueries'
import { AI_ACCESS_FILTERS, aiAccessLabels, type AiAccessFilter } from './searchParams'
import type { AdminUser, AiAccessAction } from './types'
import { UsersTable } from './UsersTable'

const route = getRouteApi('/_authenticated/admin')

const filterLabels: Record<AiAccessFilter, string> = { ...aiAccessLabels, ALL: 'Tous' }

const DEBOUNCE_MS = 300

export function AdminPage() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { user } = route.useRouteContext()
  const users = useQuery(adminUsersOptions(search))
  const { data: pendingCount } = useQuery(pendingCountOptions())
  const { mutate, isPending: actionPending, variables } = useAiAccessAction(user.id)

  // `mutate` est stable : les colonnes du tableau ne sont pas recréées à chaque rendu.
  const handleAction = useCallback(
    (target: AdminUser, kind: AiAccessAction) => mutate({ user: target, action: kind }),
    [mutate],
  )

  const totalPages = users.data?.totalPages ?? 0

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <motion.header variants={pageItemVariants} className="space-y-1">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Administration</h1>
        <p className="text-sm text-muted-foreground">Qui a droit à la boule de cristal ?</p>
      </motion.header>

      <motion.div variants={pageItemVariants} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs
          value={search.status}
          onValueChange={(value) => void navigate({ search: (prev) => ({ ...prev, status: value as AiAccessFilter, page: 0 }) })}
        >
          <TabsList className="glass max-w-full justify-start overflow-x-auto rounded-xl group-data-horizontal/tabs:h-10">
            {AI_ACCESS_FILTERS.map((filter) => (
              <TabsTrigger key={filter} value={filter} className="flex-none rounded-lg px-3">
                {filterLabels[filter]}
                {filter === 'PENDING' && !!pendingCount && (
                  <Badge className="h-4.5 min-w-4.5 px-1 text-[0.7rem]" aria-label={`${pendingCount} en attente`}>
                    {pendingCount}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <SearchInput
          value={search.q}
          onChange={(q) => void navigate({ search: (prev) => ({ ...prev, q, page: 0 }), replace: true })}
        />
      </motion.div>

      <motion.section variants={pageItemVariants} aria-label="Utilisateurs" aria-busy={users.isFetching}>
        {users.isPending ? (
          <div className="glass space-y-3 rounded-2xl p-4">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : users.isError ? (
          <ErrorState error={users.error} onRetry={() => void users.refetch()} />
        ) : users.data.content.length === 0 ? (
          <EmptyState icon={<Users />} title="Personne à l'affiche">
            {search.status === 'PENDING' && !search.q ? 'Aucune demande en attente. Pop-corn mérité !' : 'Aucun utilisateur ne correspond.'}
          </EmptyState>
        ) : (
          <div className={`glass rounded-2xl p-2 transition-opacity ${users.isPlaceholderData ? 'opacity-60' : ''}`}>
            <UsersTable
              users={users.data.content}
              currentUserId={user.id}
              pendingUserId={actionPending ? variables?.user.id : undefined}
              onAction={handleAction}
            />
          </div>
        )}
      </motion.section>

      {totalPages > 1 && (
        <nav aria-label="Pagination" className="flex items-center justify-end gap-3 text-sm text-muted-foreground">
          <span>
            Page {search.page + 1} sur {totalPages} · {users.data?.totalElements} utilisateurs
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={search.page === 0}
            onClick={() => void navigate({ search: (prev) => ({ ...prev, page: prev.page - 1 }) })}
            aria-label="Page précédente"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={search.page + 1 >= totalPages}
            onClick={() => void navigate({ search: (prev) => ({ ...prev, page: prev.page + 1 }) })}
            aria-label="Page suivante"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </nav>
      )}
    </div>
  )
}

function SearchInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [draft, setDraft] = useState(value)
  const lastSent = useRef(value)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Valeur changée par la navigation (retour arrière…) : le champ suit l'URL.
  useEffect(() => {
    if (value !== lastSent.current) {
      clearTimeout(timer.current)
      lastSent.current = value
      setDraft(value)
    }
  }, [value])

  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <div className="relative md:w-72">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        type="search"
        value={draft}
        onChange={(event) => {
          const next = event.target.value
          setDraft(next)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => {
            lastSent.current = next
            onChange(next)
          }, DEBOUNCE_MS)
        }}
        placeholder="Email ou pseudo…"
        aria-label="Rechercher par email ou pseudo"
        maxLength={100}
        className="glass h-10 rounded-xl pl-9"
      />
    </div>
  )
}
