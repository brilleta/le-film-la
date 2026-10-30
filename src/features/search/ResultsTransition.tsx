import { useElementScrollRestoration } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { resultsVariants } from '@/lib/motion'

interface ResultsTransitionProps {
  /** Une nouvelle clé remplace l'état affiché : fondu de sortie, puis entrée en cascade. */
  stateKey: string
  children: ReactNode
}

export function ResultsTransition({ stateKey, children }: ResultsTransitionProps) {
  // Une position enregistrée signale un retour sur cette page : les cartes sont déjà en place
  // et une entrée en cascade masquerait le poster qui revient vers la sienne.
  const isReturning = useElementScrollRestoration({ getElement: () => window }) !== undefined

  return (
    <AnimatePresence mode="wait" initial={!isReturning}>
      <motion.div key={stateKey} variants={resultsVariants} initial="hidden" animate="visible" exit="exit">
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
