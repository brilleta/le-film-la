import type { Video } from '@/lib/tmdb/types'

export function TrailerEmbed({ video, title }: { video: Video; title: string }) {
  return (
    <section aria-labelledby="trailer-heading" className="space-y-3">
      <h2 id="trailer-heading" className="font-heading text-xl font-semibold">
        Bande-annonce
        {video.iso_639_1 !== 'fr' && <span className="ml-2 text-sm font-normal text-muted-foreground">en VO</span>}
      </h2>
      <div className="glass aspect-video overflow-hidden rounded-2xl">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.key}`}
          title={`Bande-annonce de ${title}`}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="size-full"
        />
      </div>
    </section>
  )
}
