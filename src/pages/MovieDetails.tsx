import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchMovieDetails, fetchMovieCredits, fetchSimilarMovies, fetchMovieVideos } from '../lib/api'
import { getBackdropUrl, getPosterUrl } from '../lib/api'
import MediaGrid from '../components/media/MediaGrid'

function MovieDetails() {
  const { id } = useParams<{ id: string }>()
  const movieId = Number(id)

  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ['movieDetails', movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId,
  })

  const { data: credits } = useQuery({
    queryKey: ['movieCredits', movieId],
    queryFn: () => fetchMovieCredits(movieId),
    enabled: !!movieId,
  })

  const { data: similar } = useQuery({
    queryKey: ['similarMovies', movieId],
    queryFn: () => fetchSimilarMovies(movieId),
    enabled: !!movieId,
  })

  const { data: videos } = useQuery({
    queryKey: ['movieVideos', movieId],
    queryFn: () => fetchMovieVideos(movieId),
    enabled: !!movieId,
  })

  if (movieLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-4">
        <span className="text-6xl mb-4">😕</span>
        <h2 className="text-xl font-semibold text-white mb-2">Movie not found</h2>
        <Link to="/movies" className="text-red-600 hover:text-red-500 transition-colors">
          Back to Movies
        </Link>
      </div>
    )
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path)
  const posterUrl = getPosterUrl(movie.poster_path)
  const cast = credits?.cast?.slice(0, 12) || []
  const similarMovies = Array.isArray(similar) ? similar : similar?.results || []
  const trailer = videos?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube') || videos?.[0]

  return (
    <div className="min-h-screen">
      {/* Backdrop Hero */}
      <div className="relative h-[70vh] min-h-[450px] w-full overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 lg:p-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10">
            {/* Poster */}
            {posterUrl && (
              <div className="hidden md:block flex-shrink-0">
                <img
                  src={posterUrl}
                  alt={movie.title}
                  className="w-56 lg:w-64 rounded-xl shadow-2xl shadow-black/50 border border-white/10"
                />
              </div>
            )}

            {/* Details */}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                {movie.title}
              </h1>

              {/* Tagline */}
              {movie.tagline && (
                <p className="text-gray-400 italic mb-3">{movie.tagline}</p>
              )}

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {movie.vote_average > 0 && (
                  <span className="text-yellow-400 font-semibold">
                    ★ {movie.vote_average.toFixed(1)}
                  </span>
                )}
                {movie.release_date && (
                  <span className="text-gray-300">{movie.release_date.slice(0, 4)}</span>
                )}
                {movie.runtime > 0 && (
                  <span className="text-gray-300">{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                )}
                {movie.genres?.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-gray-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              {movie.overview && (
                <p className="text-gray-300 text-base sm:text-lg mb-6 max-w-3xl leading-relaxed">
                  {movie.overview}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  to={`/watch/${movie.id}?type=movie`}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Now
                </Link>

                {trailer?.key && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Trailer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      {cast.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-2xl font-bold text-white mb-6">Cast</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {cast.map((person: any) => (
              <div key={person.id} className="flex-shrink-0 w-28">
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 mb-2">
                  {person.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                      <span className="text-gray-500 text-2xl">👤</span>
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-white truncate">{person.name}</p>
                <p className="text-xs text-gray-400 truncate">{person.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
          <MediaGrid items={similarMovies} mediaType="movie" />
        </div>
      )}
    </div>
  )
}

export default MovieDetails