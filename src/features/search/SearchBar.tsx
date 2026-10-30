import { Search, Send } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ModeSwitch } from './ModeSwitch'
import type { SearchMode } from './searchParams'

const DEBOUNCE_MS = 300

interface SearchBarProps {
  query: string
  mode: SearchMode
  onQueryChange: (query: string) => void
  onModeChange: (mode: SearchMode, query: string) => void
}

export function SearchBar({ query, mode, onQueryChange, onModeChange }: SearchBarProps) {
  const [value, setValue] = useState(query)
  // Dernière valeur envoyée à l'URL : tout autre changement vient de la navigation (retour arrière…).
  const lastSent = useRef(query)
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (query !== lastSent.current) {
      clearTimeout(debounceTimer.current)
      lastSent.current = query
      setValue(query)
    }
  }, [query])

  useEffect(() => () => clearTimeout(debounceTimer.current), [])

  const send = (nextQuery: string) => {
    clearTimeout(debounceTimer.current)
    lastSent.current = nextQuery
    onQueryChange(nextQuery)
  }

  const handleClassicChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuery = event.target.value
    setValue(nextQuery)
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => send(nextQuery), DEBOUNCE_MS)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (value !== lastSent.current) send(value)
  }

  const handleModeChange = (nextMode: SearchMode) => {
    clearTimeout(debounceTimer.current)
    lastSent.current = value
    onModeChange(nextMode, value)
  }

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="glass flex w-full flex-col gap-2 rounded-2xl p-2 transition-shadow focus-within:shadow-[0_0_40px_oklch(0.83_0.15_80/18%)]"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        {mode === 'classic' ? (
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              type="search"
              value={value}
              onChange={handleClassicChange}
              placeholder="Le titre du film…"
              aria-label="Titre du film"
              autoComplete="off"
              enterKeyHint="search"
              className="h-11 rounded-xl border-transparent bg-transparent pl-10 text-base md:text-base dark:bg-transparent"
            />
          </div>
        ) : (
          <Textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleTextareaKeyDown}
            placeholder="Mais si, le film avec…"
            aria-label="Description libre du film"
            aria-describedby="ai-search-hint"
            rows={4}
            className="min-h-28 flex-1 resize-y rounded-xl border-transparent bg-transparent text-base md:text-base dark:bg-transparent"
          />
        )}
        <ModeSwitch mode={mode} onChange={handleModeChange} />
      </div>
      {mode === 'ai' && (
        <div className="flex items-center justify-between gap-3 px-2 pb-1">
          <p id="ai-search-hint" className="text-xs text-muted-foreground">
            Entrée pour lancer, Maj + Entrée pour aller à la ligne.
          </p>
          <Button type="submit" disabled={value.trim().length === 0}>
            <Send aria-hidden="true" />
            Chercher
          </Button>
        </div>
      )}
    </form>
  )
}
