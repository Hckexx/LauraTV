import { Link } from 'react-router-dom'
import { getBackdropUrl } from '../../lib/api'

interface HeroBannerProps {
  id: number
  title: string
  description: string
  backdropPath: string | null
  mediaType: 'movie' | 'tv'
  rating?: number
  year?: string
}

function HeroBanner({ id, title, description, backdropPath, mediaType, rating, year }: HeroBannerProps) {
  const backdropUrl = getBackdropUrl(backdropPath)

  const detailsPath = mediaType === 'movie' ? `/movie/${id}` : `/tv/${id}`

  return (
    <div className="relative h-[80vh] min-h-[500px] w-full overflow-hidden">
      {backdropUrl && (
        <img
          src={backdropUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-12 max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
          {title}
        </h1>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          {rating && (
            <span className="text-yellow-400 font-semibold">★ {rating.toFixed(1)}</span>
          )}
          {year && <span className="text-gray-300">{year}</span>}
        </div>

        <p className="text-gray-300 text-base sm:text-lg mb-6 line-clamp-3 max-w-2xl">
          {description}
        </p>

        <div className="flex gap-4">
          <Link
            to={`/watch/${id}?type=${mediaType}`}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Now
          </Link>
          <Link
            to={detailsPath}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner