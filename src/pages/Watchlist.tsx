import { useState, useEffect } from 'react'
import { getWatchlist } from '../lib/watchlist'
import MediaGrid from '../components/media/MediaGrid'

interface WatchlistItem {
  id: number
  mediaType: 'movie' | 'tv'
  title: string
  posterPath: string | null
  rating?: number
  year?: string
  addedAt: string
}

function Watchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv'>('all')

  useEffect(() => {
    setItems(getWatchlist())
  }, [])

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter((item) => item.mediaType === filter)

  const movies = filteredItems.filter((item) => item.mediaType === 'movie')
  const tvShows = filteredItems.filter((item) => item.mediaType === 'tv')

  
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">My Watchlist</h1>
        <p className="text-gray-400">Movies and TV shows you saved for later</p>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex gap-2 bg-white/5 rounded-lg p-1 inline-flex">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
              filter === 'all'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter('movie')}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
              filter === 'movie'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Movies ({items.filter((i) => i.mediaType === 'movie').length})
          </button>
          <button
            onClick={() => setFilter('tv')}
            className={`px-5 py-2 rounded-md text-sm font-semibold transition-all ${
              filter === 'tv'
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            TV Shows ({items.filter((i) => i.mediaType === 'tv').length})
          </button>
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <span className="text-6xl mb-4">📑</span>
          <h2 className="text-xl font-semibold text-white mb-2">Your watchlist is empty</h2>
          <p className="text-gray-400 text-center mb-6">
            Browse movies and TV shows, then click "Add to Watchlist" to save them here
          </p>
          <a
            href="/movies"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Browse Movies
          </a>
        </div>
      )}

      {/* Filtered Empty State */}
      {items.length > 0 && filteredItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <span className="text-6xl mb-4">📑</span>
          <p className="text-gray-400">No {filter === 'movie' ? 'movies' : 'TV shows'} in your watchlist</p>
        </div>
      )}

      {/* Watchlist Grid */}
      {filteredItems.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-8 pb-12">
          {/* Movies section */}
          {movies.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">Movies</h2>
              <MediaGrid
                items={movies.map((item) => ({
                  id: item.id,
                  title: item.title,
                  poster_path: item.posterPath,
                  vote_average: item.rating,
                  release_date: item.year,
                }))}
                mediaType="movie"
              />
            </section>
          )}

          {/* TV section */}
          {tvShows.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-4">TV Shows</h2>
              <MediaGrid
                items={tvShows.map((item) => ({
                  id: item.id,
                  name: item.title,
                  poster_path: item.posterPath,
                  vote_average: item.rating,
                  first_air_date: item.year,
                }))}
                mediaType="tv"
              />
            </section>
          )}

          {/* Remove hint */}
          <p className="text-gray-500 text-sm text-center mt-8">
            Tip: Go to a movie or TV show page and click "Remove from Watchlist" to delete it
          </p>
        </div>
      )}
    </div>
  )
}

export default Watchlist