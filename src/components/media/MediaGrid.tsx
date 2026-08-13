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
  genre_ids?: number[]
}

interface MediaGridProps {
  items: MediaItem[]
  mediaType: 'movie' | 'tv'
}

function MediaGrid({ items, mediaType }: MediaGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="text-6xl mb-4">🎬</span>
        <p className="text-gray-400 text-lg">No content found</p>
        <p className="text-gray-500 text-sm mt-2">Try a different genre or filter</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
      {items.map((item) => {
        const itemTitle = item.title || item.name || 'Untitled'
        const year = item.release_date
          ? item.release_date.slice(0, 4)
          : item.first_air_date
          ? item.first_air_date.slice(0, 4)
          : undefined

        return (
          <MediaCard
            key={item.id}
            id={item.id}
            title={itemTitle}
            posterPath={item.poster_path}
            mediaType={mediaType}
            rating={item.vote_average}
            year={year}
          />
        )
      })}
    </div>
  )
}

export default MediaGrid