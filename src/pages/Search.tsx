import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { searchMovies, searchTVShows, searchEpisodes, fetchTrendingMovies, fetchTopRatedMovies, fetchTrendingTVShows } from '../lib/api'
import MediaGrid from '../components/media/MediaGrid'
import GenrePills from '../components/media/GenrePills'

function Search() {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'trending' | 'top-rated'>('trending')
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim())
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch default content (shown when no search)
  const { data: trendingMovies, isLoading: trendingMoviesLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: fetchTrendingMovies,
    enabled: debouncedQuery.length === 0 && activeTab === 'trending',
  })

  const { data: trendingTV, isLoading: trendingTVLoading } = useQuery({
    queryKey: ['trendingTV'],
    queryFn: fetchTrendingTVShows,
    enabled: debouncedQuery.length === 0 && activeTab === 'trending',
  })

  const { data: topRatedMovies, isLoading: topRatedLoading } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: fetchTopRatedMovies,
    enabled: debouncedQuery.length === 0 && activeTab === 'top-rated',
  })

  // Fetch search results
  const { data: movieResults, isLoading: moviesLoading } = useQuery({
    queryKey: ['searchMovies', debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  })

  const { data: tvResults, isLoading: tvLoading } = useQuery({
    queryKey: ['searchTV', debouncedQuery],
    queryFn: () => searchTVShows(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  })

  const { data: episodeResults, isLoading: episodesLoading } = useQuery({
    queryKey: ['searchEpisodes', debouncedQuery],
    queryFn: () => searchEpisodes(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  })

  const hasSearched = debouncedQuery.length > 0
  const isLoading = moviesLoading || tvLoading || episodesLoading

  const episodes = episodeResults || []
  const hasEpisodeResults = episodes.length > 0

  // Default content
  const defaultMovies = activeTab === 'trending' ? (trendingMovies || []) : (topRatedMovies || [])
  const defaultTV = activeTab === 'trending' ? (trendingTV || []) : []
  const defaultLoading = activeTab === 'trending' ? (trendingMoviesLoading || trendingTVLoading) : topRatedLoading

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Search</h1>
        
        {/* Search Input - Full width premium */}
        <div className="relative w-full">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for movies, TV shows, episodes..."
            className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600/60 focus:ring-2 focus:ring-red-600/20 focus:bg-white/10 transition-all duration-300 text-base sm:text-lg"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Search Results */}
      {hasSearched && (
        <>
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* No Results State */}
          {!isLoading && (movieResults || []).length === 0 && (tvResults || []).length === 0 && !hasEpisodeResults && (
            <div className="flex flex-col items-center justify-center py-20 px-4">
              <span className="text-6xl mb-4">😕</span>
              <h2 className="text-xl font-semibold text-white mb-2">No results found</h2>
              <p className="text-gray-400 text-center">
                Try a different search term or check your spelling
              </p>
            </div>
          )}

          {/* Results */}
          {!isLoading && ((movieResults || []).length > 0 || (tvResults || []).length > 0 || hasEpisodeResults) && (
            <div className="px-4 sm:px-6 lg:px-8 pb-12 space-y-10">
              {(movieResults || []).length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Movies</h2>
                  <MediaGrid items={movieResults || []} mediaType="movie" />
                </section>
              )}

              {(tvResults || []).length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">TV Shows</h2>
                  <MediaGrid items={tvResults || []} mediaType="tv" />
                </section>
              )}

              {/* Episode Results */}
              {hasEpisodeResults && (
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Episodes</h2>
                  <div className="space-y-3">
                    {episodes.map((episode: any) => (
                      <Link
                        key={episode.id}
                        to={`/tv/${episode.show_id}/season/${episode.season_number}`}
                        className="group flex gap-4 bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-red-600/50 hover:bg-white/10 transition-all"
                      >
                        {/* Episode Still */}
                        <div className="flex-shrink-0 w-36 sm:w-44 md:w-52 aspect-video overflow-hidden">
                          {episode.still_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w400${episode.still_path}`}
                              alt={episode.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-800">
                              <span className="text-gray-500 text-2xl">🎬</span>
                            </div>
                          )}
                        </div>

                        {/* Episode Info */}
                        <div className="flex-1 py-3 pr-4 min-w-0">
                          <p className="text-xs text-red-500 font-medium mb-1">
                            {episode.show_name || `Show #${episode.show_id}`}
                          </p>
                          <p className="text-xs text-gray-400 mb-1">
                            Season {episode.season_number} • Episode {episode.episode_number}
                            {episode.runtime > 0 && ` • ${episode.runtime} min`}
                          </p>
                          <h3 className="font-semibold text-white group-hover:text-red-500 transition-colors truncate">
                            {episode.name}
                          </h3>
                          {episode.overview && (
                            <p className="text-sm text-gray-400 mt-1.5 line-clamp-2 hidden sm:block">
                              {episode.overview}
                            </p>
                          )}
                          {episode.air_date && (
                            <p className="text-xs text-gray-500 mt-1.5">
                              Aired: {new Date(episode.air_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          )}
                        </div>

                        {/* Arrow */}
                        <div className="flex items-center pr-4">
                          <svg className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </>
      )}

      {/* Default Content (no search) */}
      {!hasSearched && (
        <>
          {/* Genre Pills */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <GenrePills />
          </div>

          {/* Tabs for Trending / Top Rated */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <div className="flex gap-2 bg-white/5 rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeTab === 'trending'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🔥 Trending
              </button>
              <button
                onClick={() => setActiveTab('top-rated')}
                className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
                  activeTab === 'top-rated'
                    ? 'bg-red-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🏆 Top Rated
              </button>
            </div>
          </div>

          {/* Loading State */}
          {defaultLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Default Media Grids */}
          {!defaultLoading && (
            <div className="px-4 sm:px-6 lg:px-8 pb-12 space-y-10">
              {defaultMovies.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">
                    {activeTab === 'trending' ? 'Trending Movies' : 'Top Rated Movies'}
                  </h2>
                  <MediaGrid items={defaultMovies} mediaType="movie" />
                </section>
              )}

              {activeTab === 'trending' && defaultTV.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white mb-4">Trending TV Shows</h2>
                  <MediaGrid items={defaultTV} mediaType="tv" />
                </section>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Search