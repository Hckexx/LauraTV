import { useParams, Link } from 'react-router-dom'
import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchTVSeason, fetchTVDetails } from '../lib/api'
import { getPosterUrl } from '../lib/api'

function SeasonDetails() {
  const { id, seasonNumber } = useParams<{ id: string; seasonNumber: string }>()
  const tvId = Number(id)
  const seasonNum = Number(seasonNumber)
  const [episodeSearch, setEpisodeSearch] = useState('')

  const { data: show } = useQuery({
    queryKey: ['tvDetails', tvId],
    queryFn: () => fetchTVDetails(tvId),
    enabled: !!tvId,
  })

  const { data: season, isLoading: seasonLoading } = useQuery({
    queryKey: ['tvSeason', tvId, seasonNum],
    queryFn: () => fetchTVSeason(tvId, seasonNum),
    enabled: !!tvId && !!seasonNum,
  })

  const episodes = season?.episodes || []

  const filteredEpisodes = useMemo(() => {
    const query = episodeSearch.trim().toLowerCase()
    if (!query) return episodes

    return episodes.filter((episode: any) => {
      const title = (episode.name || '').toLowerCase()
      const overview = (episode.overview || '').toLowerCase()
      const episodeNum = String(episode.episode_number)
      return title.includes(query) || overview.includes(query) || episodeNum === query
    })
  }, [episodes, episodeSearch])

  if (seasonLoading) {
    return (
      <div className="flex items-center justify-center py-40">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!season) {
    return (
      <div className="flex flex-col items-center justify-center py-40 px-4">
        <span className="text-6xl mb-4">😕</span>
        <h2 className="text-xl font-semibold text-white mb-2">Season not found</h2>
        <Link to={`/tv/${tvId}`} className="text-red-600 hover:text-red-500 transition-colors">
          Back to Show
        </Link>
      </div>
    )
  }

  const seasonPoster = getPosterUrl(season.poster_path || show?.poster_path)

  return (
    <div className="min-h-screen">
      {/* Season Header */}
      <div className="relative overflow-hidden">
        {seasonPoster && (
          <div className="absolute inset-0">
            <img
              src={seasonPoster}
              alt={season.name}
              className="w-full h-full object-cover opacity-20 blur-sm"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
          <Link
            to={`/tv/${tvId}`}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to {show?.name || 'Show'}
          </Link>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{season.name}</h1>
          <p className="text-gray-400">
            {episodes.length} episodes
            {season.air_date && ` • ${season.air_date.slice(0, 4)}`}
          </p>
          {season.overview && (
            <p className="text-gray-300 mt-3 max-w-3xl">{season.overview}</p>
          )}

          {/* Episode Search Bar */}
          <div className="relative w-full max-w-2xl mt-5">
            <input
              type="text"
              value={episodeSearch}
              onChange={(e) => setEpisodeSearch(e.target.value)}
              placeholder="Search episodes by title, number, or description..."
              className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-600/60 focus:ring-2 focus:ring-red-600/20 focus:bg-white/10 transition-all duration-300 text-sm sm:text-base"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              {episodeSearch ? (
                <button
                  onClick={() => setEpisodeSearch('')}
                  className="text-gray-400 hover:text-white transition-colors pointer-events-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episode List */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* No matches state */}
        {filteredEpisodes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-5xl mb-3">🔍</span>
            <p className="text-gray-400">No episodes match "{episodeSearch}"</p>
          </div>
        )}

        <div className="space-y-4">
          {filteredEpisodes.map((episode: any) => (
            <div
              key={episode.id}
              className="group flex gap-4 bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-red-600/50 hover:bg-white/10 transition-all"
            >
              {/* Episode Still */}
              <div className="flex-shrink-0 w-40 sm:w-48 md:w-56 aspect-video overflow-hidden">
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
              <div className="flex-1 py-4 pr-4 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 mb-1">
                      Episode {episode.episode_number}
                      {episode.runtime > 0 && ` • ${episode.runtime} min`}
                    </p>
                    <h3 className="font-semibold text-white group-hover:text-red-500 transition-colors truncate">
                      {episode.name}
                    </h3>
                  </div>

                  {episode.vote_average > 0 && (
                    <span className="flex-shrink-0 text-yellow-400 text-sm font-semibold">
                      ★ {episode.vote_average.toFixed(1)}
                    </span>
                  )}
                </div>

                {episode.overview && (
                  <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                    {episode.overview}
                  </p>
                )}

                {episode.air_date && (
                  <p className="text-xs text-gray-500 mt-2">
                    Aired: {new Date(episode.air_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                )}
              </div>

              {/* Watch Button */}
              <div className="flex items-center pr-4">
                <Link
                  to={`/watch/${tvId}?type=tv&season=${episode.season_number}&episode=${episode.episode_number}`}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SeasonDetails