import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  fetchPopularMovies,
  fetchPopularTVShows,
  fetchTrendingMovies,
  fetchTrendingTVShows,
  fetchMoviesByGenre,
  fetchTVShowsByGenre,
  fetchMovieGenres,
  fetchTVGenres,
} from '../lib/api'
import MediaGrid from '../components/media/MediaGrid'

type MediaType = 'movie' | 'tv'

function Discover() {
  const [mediaType, setMediaType] = useState<MediaType>('movie')
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)

  // Fetch genres
  const { data: movieGenresData } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: fetchMovieGenres,
  })

  const { data: tvGenresData } = useQuery({
    queryKey: ['tvGenres'],
    queryFn: fetchTVGenres,
  })

  // Fetch default content (when no genre selected)
  const { data: popularMovies, isLoading: moviesLoading } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: fetchPopularMovies,
    enabled: mediaType === 'movie' && !selectedGenre,
  })

  const { data: trendingMovies } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: fetchTrendingMovies,
    enabled: mediaType === 'movie' && !selectedGenre,
  })

  const { data: popularTV, isLoading: tvLoading } = useQuery({
    queryKey: ['popularTV'],
    queryFn: fetchPopularTVShows,
    enabled: mediaType === 'tv' && !selectedGenre,
  })

  const { data: trendingTV } = useQuery({
    queryKey: ['trendingTV'],
    queryFn: fetchTrendingTVShows,
    enabled: mediaType === 'tv' && !selectedGenre,
  })

  // Fetch genre-filtered content
  const { data: genreMovies, isLoading: genreMoviesLoading } = useQuery({
    queryKey: ['genreMovies', selectedGenre],
    queryFn: () => fetchMoviesByGenre(selectedGenre!),
    enabled: mediaType === 'movie' && !!selectedGenre,
  })

  const { data: genreTV, isLoading: genreTVLoading } = useQuery({
    queryKey: ['genreTV', selectedGenre],
    queryFn: () => fetchTVShowsByGenre(selectedGenre!),
    enabled: mediaType === 'tv' && !!selectedGenre,
  })

  const movieGenres = Array.isArray(movieGenresData) ? movieGenresData : movieGenresData?.data || []
  const tvGenres = Array.isArray(tvGenresData) ? tvGenresData : tvGenresData?.data || []
  const genres = mediaType === 'movie' ? movieGenres : tvGenres

  // Combine items for display
  const items = selectedGenre
    ? mediaType === 'movie'
      ? genreMovies || []
      : genreTV || []
    : mediaType === 'movie'
      ? [...(popularMovies || []), ...(trendingMovies || [])].filter(
          (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        )
      : [...(popularTV || []), ...(trendingTV || [])].filter(
          (item, index, self) => index === self.findIndex((t) => t.id === item.id)
        )

  const isLoading =
    (mediaType === 'movie' && !selectedGenre && moviesLoading) ||
    (mediaType === 'tv' && !selectedGenre && tvLoading) ||
    (mediaType === 'movie' && !!selectedGenre && genreMoviesLoading) ||
    (mediaType === 'tv' && !!selectedGenre && genreTVLoading)

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Discover</h1>
        <p className="text-gray-400">Find your next favorite movie or TV show</p>
      </div>

      {/* Media Type Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-2 bg-white/5 rounded-lg p-1 inline-flex">
          <button
            onClick={() => {
              setMediaType('movie')
              setSelectedGenre(null)
            }}
            className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${
              mediaType === 'movie'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => {
              setMediaType('tv')
              setSelectedGenre(null)
            }}
            className={`px-6 py-2.5 rounded-md text-sm font-semibold transition-all ${
              mediaType === 'tv'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            TV Shows
          </button>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedGenre(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedGenre === null
                ? 'bg-red-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            All
          </button>
          {genres.map((genre: any) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedGenre === genre.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Media Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        {!isLoading && (
          <MediaGrid items={items} mediaType={mediaType} />
        )}
      </div>
    </div>
  )
}

export default Discover