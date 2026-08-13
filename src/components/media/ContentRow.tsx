import { useRef, useState } from 'react'
import MediaCard from './MediaCard'

interface MediaItem {
  id: number
  title?: string
  name?: string
  poster_path: string | null
  media_type?: 'movie' | 'tv'
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

interface ContentRowProps {
  title: string
  items: MediaItem[]
  mediaType?: 'movie' | 'tv'
}

function ContentRow({ title, items, mediaType }: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  if (!items || items.length === 0) return null

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    )
  }

  const scrollByAmount = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = container.clientWidth * 0.8
    const targetScroll = direction === 'left'
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative group/row mb-10">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">{title}</h2>
        <button className="text-sm text-gray-400 hover:text-white transition-colors hidden sm:block">
          View All
        </button>
      </div>

      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scrollByAmount('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 sm:w-16 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            aria-label="Scroll left"
          >
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </button>
        )}

        {/* Scrollable container */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 lg:px-8 pb-4 scrollbar-none snap-x"
        >
          {items.map((item) => {
            const itemMediaType = mediaType || item.media_type || 'movie'
            const itemTitle = item.title || item.name || 'Untitled'
            const year = item.release_date
              ? item.release_date.slice(0, 4)
              : item.first_air_date
              ? item.first_air_date.slice(0, 4)
              : undefined

            return (
              <div
                key={item.id}
                className="flex-shrink-0 w-36 sm:w-44 md:w-48 snap-start"
              >
                <MediaCard
                  id={item.id}
                  title={itemTitle}
                  posterPath={item.poster_path}
                  mediaType={itemMediaType}
                  rating={item.vote_average}
                  year={year}
                />
              </div>
            )
          })}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scrollByAmount('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 sm:w-16 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
            aria-label="Scroll right"
          >
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        )}
      </div>
    </section>
  )
}

export default ContentRow