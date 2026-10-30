import { animate } from 'motion/react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { defaultTransition, prefersReducedMotion } from '@/lib/motion'

/**
 * Anime la hauteur de l'élément quand `dependency` change, et seulement là : l'utilisateur
 * garde la main sur la poignée du textarea. Exception assumée à « transform et opacity » :
 * un scale déformerait les champs, et le contenu sous la barre doit suivre.
 */
export function useAnimatedHeight<T extends HTMLElement>(dependency: unknown) {
  const ref = useRef<T>(null)
  const lastHeight = useRef(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      lastHeight.current = element.offsetHeight
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    const from = lastHeight.current
    const to = element.offsetHeight
    if (!from || from === to || prefersReducedMotion()) return

    const reset = () => {
      element.style.height = ''
      element.style.overflow = ''
    }
    element.style.overflow = 'hidden'
    const controls = animate(element, { height: [from, to] }, { ...defaultTransition, onComplete: reset })
    return () => {
      controls.stop()
      reset()
    }
  }, [dependency])

  return ref
}
