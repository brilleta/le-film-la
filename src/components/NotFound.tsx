import { Link } from '@tanstack/react-router'
import { Clapperboard } from 'lucide-react'
import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <EmptyState icon={<Clapperboard />} title="Cette page n'est pas à l'affiche">
        <Button asChild variant="secondary" className="mt-2">
          <Link to="/" search={{ q: '', mode: 'classic' }}>
            Retour à la recherche
          </Link>
        </Button>
      </EmptyState>
    </div>
  )
}
