import { useQuery } from '@tanstack/react-query'
import { posterUrl } from '@/lib/tmdb/images'
import { trendingMoviesOptions } from '@/lib/tmdb/queries'

export function PosterMosaic() {
  const { data } = useQuery(trendingMoviesOptions())
  const posters = (data?.results ?? []).flatMap((movie) => posterUrl(movie.poster_path) ?? [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(ellipse_at_top,oklch(0.25_0.04_270),var(--background)_70%)]"
    >
      {/* Les affiches sont doublées pour remplir aussi les écrans très hauts ou très larges. */}
      <div className="grid scale-110 grid-cols-3 gap-2 opacity-45 blur-[3px] sm:grid-cols-5 lg:grid-cols-7">
        {[...posters, ...posters].map((src, index) => (
          <img
            key={index}
            src={src}
            alt=""
            decoding="async"
            className="animate-in aspect-2/3 w-full rounded-md object-cover duration-700 fade-in"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.14_0.015_270/72%),oklch(0.14_0.015_270/94%))]" />
    </div>
  )
}
