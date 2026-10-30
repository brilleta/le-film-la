import tmdbLogo from '@/assets/tmdb-logo.svg'

export function Footer() {
  return (
    <footer className="border-t border-border/60 py-6 text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:flex-row sm:text-left">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer"
          className="shrink-0 rounded-sm"
        >
          <img src={tmdbLogo} alt="The Movie Database (TMDB)" className="h-3" />
        </a>
        <p>This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.</p>
      </div>
    </footer>
  )
}
