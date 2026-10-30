import { Search, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { indicatorSpring } from '@/lib/motion'
import type { SearchMode } from './searchParams'

const itemClassName =
  'relative isolate h-9 flex-1 gap-1.5 px-3 sm:flex-none text-muted-foreground data-[state=on]:bg-transparent data-[state=on]:text-primary-foreground data-[state=on]:hover:bg-transparent data-[state=on]:hover:text-primary-foreground'

function ActiveIndicator() {
  return (
    <motion.span
      layoutId="search-mode-indicator"
      data-mode-indicator
      style={{ borderRadius: 10 }}
      transition={indicatorSpring}
      className="absolute inset-0 -z-10 bg-primary"
    />
  )
}

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
        {mode === 'classic' && <ActiveIndicator />}
        <Search aria-hidden="true" />
        Classique
      </ToggleGroupItem>
      <ToggleGroupItem value="ai" className={itemClassName}>
        {mode === 'ai' && <ActiveIndicator />}
        <Sparkles aria-hidden="true" />
        IA
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
