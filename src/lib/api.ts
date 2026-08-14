const API_BASE_URL = 'https://ibrax-server.onrender.com/api/v1'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

async function fetchFromAPI(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }
  
  return response.json()
}

// ==================== TRENDING ====================

// Fetch trending movies
export async function fetchTrendingMovies() {
  const data = await fetchFromAPI('/trending/movies')
  return data.data || []
}

// Fetch trending TV shows
export async function fetchTrendingTVShows() {
  const data = await fetchFromAPI('/trending/tv')
  return data.data || []
}

// ==================== MOVIES ====================

// Fetch popular movies
export async function fetchPopularMovies() {
  const data = await fetchFromAPI('/movies/popular')
  return data.data || []
}

// Fetch top rated movies
export async function fetchTopRatedMovies() {
  const data = await fetchFromAPI('/movies/top-rated')
  return data.data || []
}

// Fetch upcoming movies
export async function fetchUpcomingMovies() {
  const data = await fetchFromAPI('/movies/upcoming')
  return data.data || []
}

// Fetch now playing movies
export async function fetchNowPlayingMovies() {
  const data = await fetchFromAPI('/movies/now-playing')
  return data.data || []
}

// Fetch movie details
export async function fetchMovieDetails(id: number) {
  const data = await fetchFromAPI(`/movies/${id}`)
  return data.data || data
}

// Fetch movie credits
export async function fetchMovieCredits(id: number) {
  const data = await fetchFromAPI(`/movies/${id}/credits`)
  return data.data || data
}

// Fetch similar movies
export async function fetchSimilarMovies(id: number) {
  const data = await fetchFromAPI(`/movies/${id}/similar`)
  return data.data || data.results || []
}

// Fetch movie videos
export async function fetchMovieVideos(id: number) {
  const data = await fetchFromAPI(`/movies/${id}/videos`)
  return data.data || data.results || []
}

// Fetch movie genres
export async function fetchMovieGenres() {
  const data = await fetchFromAPI('/movies/genres')
  return data.data || data
}

// Fetch movies by genre
export async function fetchMoviesByGenre(genreId: number) {
  const data = await fetchFromAPI(`/discover/movie?with_genres=${genreId}`)
  return data.data || data.results || []
}

// ==================== TV SHOWS ====================

// Fetch popular TV shows
export async function fetchPopularTVShows() {
  const data = await fetchFromAPI('/tv/popular')
  return data.data || []
}

// Fetch top rated TV shows
export async function fetchTopRatedTVShows() {
  const data = await fetchFromAPI('/tv/top-rated')
  return data.data || []
}

// Fetch airing today TV
export async function fetchAiringTodayTV() {
  const data = await fetchFromAPI('/tv/airing-today')
  return data.data || []
}

// Fetch TV show details
export async function fetchTVDetails(id: number) {
  const data = await fetchFromAPI(`/tv/${id}`)
  return data.data || data
}

// Fetch TV credits
export async function fetchTVCredits(id: number) {
  const data = await fetchFromAPI(`/tv/${id}/credits`)
  return data.data || data
}

// Fetch similar TV shows
export async function fetchSimilarTVShows(id: number) {
  const data = await fetchFromAPI(`/tv/${id}/similar`)
  return data.data || data.results || []
}

// Fetch TV videos
export async function fetchTVVideos(id: number) {
  const data = await fetchFromAPI(`/tv/${id}/videos`)
  return data.data || data.results || []
}

// Fetch TV season details
export async function fetchTVSeason(tvId: number, seasonNumber: number) {
  const data = await fetchFromAPI(`/tv/${tvId}/season/${seasonNumber}`)
  return data.data || data
}

// Fetch TV genres
export async function fetchTVGenres() {
  const data = await fetchFromAPI('/tv/genres')
  return data.data || data
}

// Fetch TV shows by genre
export async function fetchTVShowsByGenre(genreId: number) {
  const data = await fetchFromAPI(`/discover/tv?with_genres=${genreId}`)
  return data.data || data.results || []
}

// ==================== SEARCH ====================

// Search movies
export async function searchMovies(query: string) {
  const data = await fetchFromAPI(`/search/movie?query=${encodeURIComponent(query)}`)
  return data.data || data.results || []
}

// Search TV shows
export async function searchTVShows(query: string) {
  const data = await fetchFromAPI(`/search/tv?query=${encodeURIComponent(query)}`)
  return data.data || data.results || []
}

// Fetch stream/watch URL for a movie or TV episode
export async function fetchWatchUrl(mediaId: number, mediaType: string, season?: number, episode?: number) {
  let endpoint = ''
  
  if (mediaType === 'movie') {
    endpoint = `/movies/${mediaId}/watch`
  } else if (mediaType === 'tv') {
    if (season && episode) {
      endpoint = `/tv/${mediaId}/season/${season}/episode/${episode}/watch`
    } else {
      endpoint = `/tv/${mediaId}/watch`
    }
  }
  
  const data = await fetchFromAPI(endpoint)
  return data.data || data
}

// ==================== HELPERS ====================

// Helper to build poster URL
export function getPosterUrl(posterPath: string | null) {
  if (!posterPath) return null
  return `${TMDB_IMAGE_BASE}${posterPath}`
}

// Helper to build backdrop URL
export function getBackdropUrl(backdropPath: string | null) {
  if (!backdropPath) return null
  return `https://image.tmdb.org/t/p/original${backdropPath}`
}

// Search episodes
export async function searchEpisodes(query: string) {
  const data = await fetchFromAPI(`/search/episode?query=${encodeURIComponent(query)}`)
  return data.data || data.results || []
}

// Get the best trailer key from videos array
export function getTrailerKey(videos: any[]) {
  if (!videos || videos.length === 0) return null
  
  return (
    videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube' && v.official)?.key ||
    videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')?.key ||
    videos.find((v: any) => v.type === 'Teaser' && v.site === 'YouTube' && v.official)?.key ||
    videos.find((v: any) => v.site === 'YouTube')?.key ||
    null
  )
}