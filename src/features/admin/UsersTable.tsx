import { createColumnHelper, tableFeatures, useTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AiAccessBadge } from './AiAccessBadge'
import type { AdminUser, AiAccessAction } from './types'
import { UserActions } from './UserActions'

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
const formatDate = (iso: string | null) => (iso ? dateFormat.format(new Date(iso)) : '—')

// Pagination, filtre et tri sont faits par le back (search params de la route) : la table ne fait qu'afficher.
const features = tableFeatures({})
const column = createColumnHelper<typeof features, AdminUser>()

interface UsersTableProps {
  users: AdminUser[]
  currentUserId: string | undefined
  pendingUserId: string | undefined
  onAction: (user: AdminUser, action: AiAccessAction) => void
}

export function UsersTable({ users, currentUserId, pendingUserId, onAction }: UsersTableProps) {
  const columns = useMemo(
    () =>
      column.columns([
      column.accessor('username', {
        header: 'Utilisateur',
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-medium">{row.original.username}</p>
            <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      }),
      column.accessor('role', {
        header: 'Rôle',
        cell: ({ getValue }) =>
          getValue() === 'ADMIN' ? <Badge variant="outline">Admin</Badge> : <span className="text-muted-foreground">Membre</span>,
      }),
      column.accessor('aiAccess', {
        header: 'Accès IA',
        cell: ({ getValue }) => <AiAccessBadge status={getValue()} />,
      }),
      column.display({
        id: 'dates',
        header: 'Demande / décision',
        cell: ({ row }) => {
          const { aiAccessRequestedAt, aiAccessDecidedAt, aiAccessDecidedBy, createdAt } = row.original
          return (
            <div className="text-xs text-muted-foreground">
              {aiAccessRequestedAt ? <p>Demandé le {formatDate(aiAccessRequestedAt)}</p> : <p>Inscrit le {formatDate(createdAt)}</p>}
              {aiAccessDecidedAt && (
                <p>
                  Décidé le {formatDate(aiAccessDecidedAt)}
                  {aiAccessDecidedBy ? ` par ${aiAccessDecidedBy.username}` : ''}
                </p>
              )}
            </div>
          )
        },
      }),
      column.display({
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <UserActions
            user={row.original}
            isSelf={row.original.id === currentUserId}
            pending={row.original.id === pendingUserId}
            onAction={(action) => onAction(row.original, action)}
          />
        ),
      }),
    ]),
    [currentUserId, pendingUserId, onAction],
  )

  const table = useTable({ features, columns, data: users, getRowId: (user) => user.id })

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} className={header.column.id === 'actions' ? 'text-right' : undefined}>
                <table.FlexRender header={header} />
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getAllCells().map((cell) => (
              <TableCell key={cell.id} className="py-3">
                <table.FlexRender cell={cell} />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
