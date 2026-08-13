import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import Search from './pages/Search'
import Watchlist from './pages/Watchlist'
import Profile from './pages/Profile'
import MovieDetails from './pages/MovieDetails'
import TVDetails from './pages/TVDetails'
import SeasonDetails from './pages/SeasonDetails'
import Watch from './pages/Watch'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Watch page - no layout (full screen player) */}
        <Route path="/watch/:mediaId" element={<Watch />} />
        
        {/* All other pages with layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv-shows" element={<TVShows />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv/:id" element={<TVDetails />} />
          <Route path="/tv/:id/season/:seasonNumber" element={<SeasonDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App