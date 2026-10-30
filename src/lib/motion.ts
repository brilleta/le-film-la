import type { Transition, Variants } from 'motion/react'

// Durées en secondes : tout le style d'animation de l'appli se règle ici.
export const durations = { fast: 0.2, base: 0.3, slow: 0.4 }

const easeOut = [0.22, 1, 0.36, 1] as const
const easeIn = [0.4, 0, 1, 1] as const

export const defaultTransition: Transition = { duration: durations.base, ease: easeOut }

export const hoverSpring: Transition = { type: 'spring', stiffness: 400, damping: 25 }
export const indicatorSpring: Transition = { type: 'spring', stiffness: 500, damping: 35 }

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Une page n'anime jamais transform ni opacity à l'entrée : le poster partagé qu'elle contient
// se déformerait ou s'estomperait pendant son vol. Ce sont ses sections qui entrent en cascade.
export const pageVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
  exit: { opacity: 0, transition: { duration: durations.fast, ease: easeIn } },
}

export const pageItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
  // Résolu à la sortie : MotionConfig rendrait ce glissement instantané au lieu de le supprimer.
  exit: () => ({ y: prefersReducedMotion() ? 0 : -8, transition: { duration: durations.fast, ease: easeIn } }),
}

export const pageBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.slow, ease: easeOut } },
}

// Le contenu du détail attend que le poster ait fait l'essentiel de son trajet.
export const movieContentVariants: Variants = {
  visible: { transition: { delayChildren: 0.15, staggerChildren: 0.06 } },
}

// Chaque nouvel état des résultats : fondu de l'ensemble, cartes en cascade.
export const resultsVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.fast, staggerChildren: 0.025 } },
  exit: { opacity: 0, transition: { duration: 0.12, ease: easeIn } },
}

export const gridItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: defaultTransition },
}

export const cardVariants: Variants = {
  hover: () => (prefersReducedMotion() ? {} : { scale: 1.03, y: -4 }),
}
