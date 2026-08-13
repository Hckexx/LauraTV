import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchMovieDetails, fetchTVDetails, fetchTVSeason } from '../lib/api'

interface Provider {
  id: string
  name: string
  baseDomain: string
  getUrl: (mediaId: number, mediaType: string, season?: number, episode?: number) => string
}

const providers: Provider[] = [
  {
    id: 'poseidon',
    name: 'Poseidon',
    baseDomain: 'vidking.net',
    getUrl: (id, type, season, episode) => {
      if (type === 'movie') return `https://www.vidking.net/embed/movie/${id}`
      if (type === 'tv' && season && episode) return `https://www.vidking.net/embed/tv/${id}/${season}/${episode}`
      return `https://www.vidking.net/embed/tv/${id}`
    },
  },
  {
    id: 'zeus',
    name: 'Zeus',
    baseDomain: 'vidsrc.sbs',
    getUrl: (id, type, season, episode) => {
      if (type === 'movie') return `https://vidsrc.sbs/embed/movie/${id}`
      if (type === 'tv' && season && episode) return `https://vidsrc.sbs/embed/tv/${id}/${season}/${episode}`
      return `https://vidsrc.sbs/embed/tv/${id}`
    },
  },
  {
    id: 'hades',
    name: 'Hades',
    baseDomain: 'vidnest.fun',
    getUrl: (id, type, season, episode) => {
      if (type === 'movie') return `https://vidnest.fun/movie/${id}?server=gama`
      if (type === 'tv' && season && episode) return `https://vidnest.fun/tv/${id}/${season}/${episode}?server=gama`
      return `https://vidnest.fun/tv/${id}?server=gama`
    },
  },
  {
    id: 'erebus',
    name: 'Erebus',
    baseDomain: 'vidcore.org',
    getUrl: (id, type, season, episode) => {
      if (type === 'movie') return `https://vidcore.org/embed/movie/${id}`
      if (type === 'tv' && season && episode) return `https://vidcore.org/embed/tv/${id}/${season}/${episode}`
      return `https://vidcore.org/embed/tv/${id}`
    },
  },
]

function Watch() {
  const { mediaId } = useParams<{ mediaId: string }>()
  const [searchParams] = useSearchParams()
  const mediaType = searchParams.get('type') || 'movie'
  const season = searchParams.get('season')
  const episode = searchParams.get('episode')
  const [activeProvider, setActiveProvider] = useState(providers[0].id)
  const [iframeError, setIframeError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const id = Number(mediaId)
  const seasonNum = season ? Number(season) : undefined
  const episodeNum = episode ? Number(episode) : undefined

  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ['movieDetails', id],
    queryFn: () => fetchMovieDetails(id),
    enabled: mediaType === 'movie' && !!id,
  })

  const { data: show, isLoading: showLoading } = useQuery({
    queryKey: ['tvDetails', id],
    queryFn: () => fetchTVDetails(id),
    enabled: mediaType === 'tv' && !!id,
  })

  const { data: seasonData } = useQuery({
    queryKey: ['tvSeason', id, seasonNum],
    queryFn: () => fetchTVSeason(id, seasonNum!),
    enabled: mediaType === 'tv' && !!id && !!seasonNum,
  })

  const isLoading = movieLoading || showLoading

  const currentEpisode = seasonData?.episodes?.find(
    (ep: any) => ep.episode_number === episodeNum
  )

  const title = mediaType === 'movie' ? movie?.title : show?.name
  const subtitle = mediaType === 'tv' && episodeNum
    ? `S${seasonNum} E${episodeNum}${currentEpisode?.name ? ` - ${currentEpisode.name}` : ''}`
    : mediaType === 'tv'
      ? 'TV Show'
      : null

  const currentProvider = providers.find((p) => p.id === activeProvider) || providers[0]
  const iframeUrl = currentProvider.getUrl(id, mediaType, seasonNum, episodeNum)

  // ============ NAVIGATION SHIELD ============

  useEffect(() => {
    // Block window.open from iframe scripts
    const originalOpen = window.open
    window.open = (url?: string | URL, target?: string, features?: string) => {
      if (!url || url === 'about:blank' || url === '') {
        return originalOpen(url, target, features)
      }
      // Block all external URLs
      return null
    }

    // Block the parent page from being redirected
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (iframeRef.current) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    // Block hash changes that try to navigate away
    const handleHashChange = (e: HashChangeEvent) => {
      if (iframeRef.current) {
        e.preventDefault()
      }
    }

    // Block popstate
    const handlePopState = (e: PopStateEvent) => {
      if (iframeRef.current) {
        e.preventDefault()
      }
    }

    // Block all click events that try to open new windows
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor && anchor.target === '_blank') {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    // Block form submissions that try to navigate
    const handleSubmit = (e: Event) => {
      if (iframeRef.current) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('hashchange', handleHashChange)
    window.addEventListener('popstate', handlePopState)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('submit', handleSubmit, true)

    return () => {
      window.open = originalOpen
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('submit', handleSubmit, true)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/80 border-b border-white/10 z-10">
        <Link
          to={mediaType === 'movie' ? `/movie/${id}` : episodeNum ? `/tv/${id}/season/${seasonNum}` : `/tv/${id}`}
          className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <h1 className="text-white font-semibold truncate mx-4 flex-1 text-center">
          {title}
          {subtitle && <span className="text-gray-400 font-normal"> • {subtitle}</span>}
        </h1>

        <div className="w-16" />
      </div>

      {/* Player Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {isLoading && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 mt-4">Loading...</p>
          </div>
        )}

        {!isLoading && (
          <div className="w-full max-w-6xl">
            {/* Provider Switcher */}
            <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-none">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    setActiveProvider(provider.id)
                    setIframeError(false)
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeProvider === provider.id
                      ? 'bg-red-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {provider.name}
                </button>
              ))}
            </div>

            {/* Iframe Player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-white/10 relative">
              {!iframeError ? (
                <iframe
                  ref={iframeRef}
                  src={iframeUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="no-referrer"
                  onError={() => setIframeError(true)}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl mb-4">⚠️</span>
                  <p className="text-gray-400 mb-4">This provider failed to load</p>
                  <button
                    onClick={() => setIframeError(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Episode Info */}
            {mediaType === 'tv' && currentEpisode && (
              <div className="mt-4 p-4 bg-white/5 rounded-xl">
                <h2 className="text-white font-semibold mb-2">{currentEpisode.name}</h2>
                {currentEpisode.overview && (
                  <p className="text-gray-400 text-sm">{currentEpisode.overview}</p>
                )}
              </div>
            )}

            {/* Provider note */}
            <p className="text-gray-500 text-xs mt-3 text-center">
              If one provider doesn't work, try another. All providers are third-party.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Watch