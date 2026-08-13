import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  fetchPopularTVShows,
  fetchTrendingTVShows,
  fetchTopRatedTVShows,
  fetchAiringTodayTV,
  fetchTVShowsByGenre,
  fetchTVGenres,
} from '../lib/api'
import MediaGrid from '../components/media/MediaGrid'

type TVSection = 'popular' | 'trending' | 'top-rated' | 'airing-today' | 'genre'

function TVShows() {
  const [activeSection, setActiveSection] = useState<TVSection>('popular')
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null)

  // Fetch genres
  const { data: tvGenresData } = useQuery({
    queryKey: ['tvGenres'],
    queryFn: fetchTVGenres,
  })

  // Fetch different TV sections
  const { data: popularTV, isLoading: popularLoading } = useQuery({
    queryKey: ['popularTV'],
    queryFn: fetchPopularTVShows,
    enabled: activeSection === 'popular',
  })

  const { data: trendingTV, isLoading: trendingLoading } = useQuery({
    queryKey: ['trendingTV'],
    queryFn: fetchTrendingTVShows,
    enabled: activeSection === 'trending',
  })

  const { data: topRatedTV, isLoading: topRatedLoading } = useQuery({
    queryKey: ['topRatedTV'],
    queryFn: fetchTopRatedTVShows,
    enabled: activeSection === 'top-rated',
  })

  const { data: airingTodayTV, isLoading: airingLoading } = useQuery({
    queryKey: ['airingTodayTV'],
    queryFn: fetchAiringTodayTV,
    enabled: activeSection === 'airing-today',
  })

  const { data: genreTV, isLoading: genreLoading } = useQuery({
    queryKey: ['genreTV', selectedGenre],
    queryFn: () => fetchTVShowsByGenre(selectedGenre!),
    enabled: activeSection === 'genre' && !!selectedGenre,
  })

  const tvGenres = Array.isArray(tvGenresData) ? tvGenresData : tvGenresData?.data || []

  const sections = [
    { id: 'popular' as TVSection, label: 'Popular' },
    { id: 'trending' as TVSection, label: 'Trending' },
    { id: 'top-rated' as TVSection, label: 'Top Rated' },
    { id: 'airing-today' as TVSection, label: 'Airing Today' },
  ]

  const items =
    activeSection === 'popular'
      ? popularTV || []
      : activeSection === 'trending'
        ? trendingTV || []
        : activeSection === 'top-rated'
          ? topRatedTV || []
          : activeSection === 'airing-today'
            ? airingTodayTV || []
            : genreTV || []

  const isLoading =
    (activeSection === 'popular' && popularLoading) ||
    (activeSection === 'trending' && trendingLoading) ||
    (activeSection === 'top-rated' && topRatedLoading) ||
    (activeSection === 'airing-today' && airingLoading) ||
    (activeSection === 'genre' && genreLoading)

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">TV Shows</h1>
        <p className="text-gray-400">Browse all TV shows</p>
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
            {tvGenres.map((genre: any) => (
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
          <MediaGrid items={items} mediaType="tv" />
        )}
      </div>
    </div>
  )
}

export default TVShows