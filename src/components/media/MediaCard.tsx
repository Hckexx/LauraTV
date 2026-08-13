import { Link } from 'react-router-dom'
import { getPosterUrl } from '../../lib/api'

interface MediaCardProps {
  id: number
  title: string
  posterPath: string | null
  mediaType: 'movie' | 'tv'
  rating?: number
  year?: string
}

function MediaCard({ id, title, posterPath, mediaType, rating, year }: MediaCardProps) {
  const linkPath = mediaType === 'movie' ? `/movie/${id}` : `/tv/${id}`
  
  const posterUrl = getPosterUrl(posterPath)

  return (
    <Link to={linkPath} className="group relative block rounded-lg overflow-hidden bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:z-10">
      {/* Poster */}
      <div className="aspect-[2/3] overflow-hidden">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800">
            <span className="text-gray-500 text-4xl">🎬</span>
          </div>
        )}
      </div>

      {/* Rating badge */}
      {rating && (
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-yellow-400">
          ★ {rating.toFixed(1)}
        </div>
      )}

      {/* Title overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
        <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        {year && <p className="text-xs text-gray-400">{year}</p>}
      </div>
    </Link>
  )
}

export default MediaCard