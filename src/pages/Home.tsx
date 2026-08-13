import { useQuery } from '@tanstack/react-query'
import {
  fetchTrendingMovies,
  fetchPopularMovies,
  fetchPopularTVShows,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
  fetchNowPlayingMovies,
  fetchAiringTodayTV,
} from '../lib/api'
import HeroBanner from '../components/media/HeroBanner'
import ContentRow from '../components/media/ContentRow'

function Home() {
  const { data: trendingMovies, isLoading: trendingLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: fetchTrendingMovies,
  })

  const { data: popularMovies } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: fetchPopularMovies,
  })

  const { data: popularTV } = useQuery({
    queryKey: ['popularTV'],
    queryFn: fetchPopularTVShows,
  })

  const { data: topRated } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: fetchTopRatedMovies,
  })

  const { data: upcoming } = useQuery({
    queryKey: ['upcomingMovies'],
    queryFn: fetchUpcomingMovies,
  })

  const { data: nowPlaying } = useQuery({
    queryKey: ['nowPlayingMovies'],
    queryFn: fetchNowPlayingMovies,
  })

  const { data: airingToday } = useQuery({
    queryKey: ['airingTodayTV'],
    queryFn: fetchAiringTodayTV,
  })

  const trendingItems = trendingMovies || []
  const popularMovieItems = popularMovies || []
  const popularTVItems = popularTV || []
  const topRatedItems = topRated || []
  const upcomingItems = upcoming || []
  const nowPlayingItems = nowPlaying || []
  const airingTodayItems = airingToday || []

  const heroItem = trendingItems[0]

  return (
    <div>
      {/* Hero Section */}
      {heroItem && (
        <HeroBanner
          id={heroItem.id}
          title={heroItem.title || heroItem.name || 'Untitled'}
          description={heroItem.overview || ''}
          backdropPath={heroItem.backdrop_path || heroItem.poster_path}
          mediaType="movie"
          rating={heroItem.vote_average}
          year={
            heroItem.release_date
              ? heroItem.release_date.slice(0, 4)
              : heroItem.first_air_date
              ? heroItem.first_air_date.slice(0, 4)
              : undefined
          }
        />
      )}

      {/* Loading state */}
      {trendingLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Content Rows */}
      <div className="pt-8 pb-8">
        <ContentRow title="🔥 Trending Movies" items={trendingItems.slice(1)} mediaType="movie" />
        <ContentRow title="🎬 Now Playing" items={nowPlayingItems} mediaType="movie" />
        <ContentRow title="⭐ Popular Movies" items={popularMovieItems} mediaType="movie" />
        <ContentRow title="📺 Popular TV Shows" items={popularTVItems} mediaType="tv" />
        <ContentRow title="🏆 Top Rated Movies" items={topRatedItems} mediaType="movie" />
        <ContentRow title="📅 Upcoming Movies" items={upcomingItems} mediaType="movie" />
        <ContentRow title="📡 Airing Today" items={airingTodayItems} mediaType="tv" />
      </div>
    </div>
  )
}

export default Home