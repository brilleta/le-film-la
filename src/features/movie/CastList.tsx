import { User } from 'lucide-react'
import { profileUrl } from '@/lib/tmdb/images'
import type { CastMember } from '@/lib/tmdb/types'

const MAX_CAST = 12

export function CastList({ cast }: { cast: CastMember[] }) {
  return (
    <section aria-labelledby="cast-heading" className="space-y-3">
      <h2 id="cast-heading" className="font-heading text-xl font-semibold">
        Casting
      </h2>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {cast.slice(0, MAX_CAST).map((member) => {
          const photo = profileUrl(member.profile_path)
          return (
            <li key={member.id} className="glass overflow-hidden rounded-xl">
              <div className="aspect-square bg-muted">
                {photo ? (
                  <img src={photo} alt="" loading="lazy" decoding="async" className="size-full object-cover object-top" />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <User className="size-8" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.character}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
