import {
  Outlet,
  RouterContextProvider,
  useElementScrollRestoration,
  useMatches,
  useRouter,
  type AnyRouteMatch,
  type ParsedLocation,
} from '@tanstack/react-router'
import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import { useLayoutEffect, useMemo, useState } from 'react'
import { pageVariants } from '@/lib/motion'

export function PageTransition() {
  // Le match, pas location : location change dès le clic, avant la fin du loader de la route.
  const routeKey = useMatches({ select: (matches) => matches.at(-1)?.id })
  const destinationScrollY = useElementScrollRestoration({ getElement: () => window })?.scrollY ?? 0

  // Pendant le rendu, pas dans un effet : Motion mesure l'ancien poster dès le rendu du nouveau.
  const [renderedRouteKey, setRenderedRouteKey] = useState(routeKey)
  if (renderedRouteKey !== routeKey) {
    setRenderedRouteKey(routeKey)
    handOffScroll(destinationScrollY)
  }

  useLayoutEffect(() => {
    document.documentElement.style.minHeight = ''
  }, [routeKey])

  return (
    <AnimatePresence>
      <Page key={routeKey} />
    </AnimatePresence>
  )
}

/**
 * Motion mesure les layoutId en coordonnées de page : si le scroll change entre la mesure de
 * l'ancien poster et celle du nouveau, le poster part du mauvais endroit. Le scroll prend donc
 * sa valeur finale avant toute mesure, et l'ancienne page est figée pour ne pas bouger à l'écran.
 */
function handOffScroll(destinationScrollY: number) {
  const page = document.querySelector<HTMLElement>('[data-page="active"]')
  // StrictMode rend deux fois : la page déjà figée a gardé son décalage, le scroll a déjà changé.
  if (page?.style.position === 'fixed') return
  if (page) {
    Object.assign(page.style, {
      position: 'fixed',
      top: `${-window.scrollY}px`,
      left: '0',
      right: '0',
      pointerEvents: 'none',
    })
  }

  // La nouvelle page n'est pas encore là pour donner sa hauteur au document.
  document.documentElement.style.minHeight = `${destinationScrollY + window.innerHeight}px`
  window.scrollTo({ top: destinationScrollY, behavior: 'instant' })
}

function Page() {
  const isPresent = useIsPresent()
  const router = useFrozenRouter(isPresent)

  return (
    <motion.div
      data-page={isPresent ? 'active' : 'exiting'}
      className="relative flex flex-1 flex-col"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <RouterContextProvider router={router}>
        <Outlet />
      </RouterContextProvider>
    </motion.div>
  )
}

type Router = ReturnType<typeof useRouter>

const frozenStore = <T,>(value: T) => ({ get: () => value, subscribe: () => ({ unsubscribe: () => {} }) })

/**
 * Pendant sa sortie, une page reste montée alors que le routeur a déjà changé de route :
 * Outlet afficherait la nouvelle page et Route.useParams() lèverait une erreur.
 * On lui donne donc une copie du routeur figée sur le dernier état qu'elle a affiché.
 */
function useFrozenRouter(isPresent: boolean): Router {
  const router = useRouter()
  const matches = useMatches()
  const [snapshot, setSnapshot] = useState({ matches, location: router.stores.location.get() })
  if (isPresent && snapshot.matches !== matches) {
    setSnapshot({ matches, location: router.stores.location.get() })
  }

  return useMemo(() => (isPresent ? router : freezeRouter(router, snapshot)), [isPresent, router, snapshot])
}

function freezeRouter(router: Router, { matches, location }: { matches: AnyRouteMatch[]; location: ParsedLocation }) {
  return Object.create(router, {
    stores: {
      value: {
        ...router.stores,
        ids: frozenStore(matches.map((match) => match.routeId)),
        matches: frozenStore(matches),
        location: frozenStore(location),
        resolvedLocation: frozenStore(location),
        getMatchStore: (routeId: string) => frozenStore(matches.find((match) => match.routeId === routeId)),
      },
    },
  }) as Router
}
