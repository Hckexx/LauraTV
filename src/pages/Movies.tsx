import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  fetchPopularMovies,
  fetchTrendingMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchMoviesByGenre,
  fetchMovieGenres,
} from '../lib/api'
import MediaGrid from '../components/media/MediaGrid'

type MovieSection = 'popular' | 'trending' | 'top-rated' | 'upcoming' | 'now-playing' | 'genre'

function Movies() {
  const [activeSection, setActiveSection] = useState<MovieSection>('popular')
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)

  // Fetch genres
  const { data: movieGenresData } = useQuery({
    queryKey: ['movieGenres'],
    queryFn: fetchMovieGenres,
  })

  // Fetch different movie sections
  const { data: popularMovies, isLoading: popularLoading } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: fetchPopularMovies,
    enabled: activeSection === 'popular',
  })

  const { data: trendingMovies, isLoading: trendingLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: fetchTrendingMovies,
    enabled: activeSection === 'trending',
  })

  const { data: topRatedMovies, isLoading: topRatedLoading } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: fetchTopRatedMovies,
    enabled: activeSection === 'top-rated',
  })

  const { data: upcomingMovies, isLoading: upcomingLoading } = useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: fetchUpcomingMovies,
    enabled: activeSection === 'upcoming',
  })

  const { data: nowPlayingMovies, isLoading: nowPlayingLoading } = useQuery({
    queryKey: ['nowPlayingMovies'],
    queryFn: fetchNowPlayingMovies,
    enabled: activeSection === 'now-playing',
  })

  const { data: genreMovies, isLoading: genreLoading } = useQuery({
    queryKey: ['genreMovies', selectedGenre],
    queryFn: () => fetchMoviesByGenre(selectedGenre!),
    enabled: activeSection === 'genre' && !!selectedGenre,
  })

  const movieGenres = Array.isArray(movieGenresData) ? movieGenresData : movieGenresData?.data || []

  const sections = [
    { id: 'popular' as MovieSection, label: 'Popular' },
    { id: 'trending' as MovieSection, label: 'Trending' },
    { id: 'top-rated' as MovieSection, label: 'Top Rated' },
    { id: 'upcoming' as MovieSection, label: 'Upcoming' },
    { id: 'now-playing' as MovieSection, label: 'Now Playing' },
  ]

  const items =
    activeSection === 'popular'
      ? popularMovies || []
      : activeSection === 'trending'
        ? trendingMovies || []
        : activeSection === 'top-rated'
          ? topRatedMovies || []
          : activeSection === 'upcoming'
            ? upcomingMovies || []
            : activeSection === 'now-playing'
              ? nowPlayingMovies || []
              : genreMovies || []

  const isLoading =
    (activeSection === 'popular' && popularLoading) ||
    (activeSection === 'trending' && trendingLoading) ||
    (activeSection === 'top-rated' && topRatedLoading) ||
    (activeSection === 'upcoming' && upcomingLoading) ||
    (activeSection === 'now-playing' && nowPlayingLoading) ||
    (activeSection === 'genre' && genreLoading)

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Movies</h1>
        <p className="text-gray-400">Browse all movies</p>
      </div>

      {/* Section Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id)
                if (section.id !== 'genre') {
                  setSelectedGenre(null)
                }
              }}
              className={`flex-shrink-0 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeSection === section.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Pills (shown when Genre tab is active) */}
      {activeSection === 'genre' && (
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {movieGenres.map((genre: any) => (
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
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Media Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        {!isLoading && (
          <MediaGrid items={items} mediaType="movie" />
        )}
      </div>
    </div>
  )
}

export default Movies