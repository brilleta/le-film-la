import { Search, Sparkles } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import type { SearchMode } from './searchParams'

const itemClassName =
  'h-9 flex-1 gap-1.5 px-3 sm:flex-none text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-primary data-[state=on]:hover:text-primary-foreground'

interface ModeSwitchProps {
  mode: SearchMode
  onChange: (mode: SearchMode) => void
}

export function ModeSwitch({ mode, onChange }: ModeSwitchProps) {
  return (
    <ToggleGroup
      type="single"
      spacing={1}
      value={mode}
      // Radix renvoie une valeur vide au clic sur l'option active : un mode reste toujours sélectionné.
      onValueChange={(value) => {
        if (value) onChange(value as SearchMode)
      }}
      aria-label="Mode de recherche"
      className="w-full shrink-0 rounded-xl border border-border bg-background/50 p-1 sm:w-auto"
    >
      <ToggleGroupItem value="classic" className={itemClassName}>
        <Search aria-hidden="true" />
        Classique
      </ToggleGroupItem>
      <ToggleGroupItem value="ai" className={itemClassName}>
        <Sparkles aria-hidden="true" />
        IA
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
