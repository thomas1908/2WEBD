"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSearch } from "../context/SearchContext"
import { Search, Menu, X, Palette } from "lucide-react"

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { 
    setSearchResults, 
    setIsLoading, 
    isLoading: searchIsLoading, 
    setCurrentSearchQuery, 
    setAllObjectIds 
  } = useSearch()
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    setCurrentSearchQuery(searchQuery)
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    
    try {
      const searchResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(searchQuery)}`,
      )
      const searchData = await searchResponse.json()

      if (searchData.objectIDs && searchData.objectIDs.length > 0) {
        // Stocker tous les IDs pour le chargement infini
        setAllObjectIds(searchData.objectIDs)
        
        const limitedIds = searchData.objectIDs.slice(0, 20)

        const objectPromises = limitedIds.map((id) =>
          fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
            .then((res) => res.json())
            .catch(() => null)
        )

        const objects = await Promise.all(objectPromises)
        const validObjects = objects.filter(obj => obj && obj.primaryImage)
        
        setSearchResults({
          total: searchData.objectIDs.length,
          displayed: limitedIds.length,
          results: validObjects,
        })
      } else {
        setAllObjectIds([])
        setSearchResults({
          total: 0,
          displayed: 0,
          results: [],
        })
      }
    } catch (error) {
      console.error("Error searching objects:", error)
      setAllObjectIds([])
      setSearchResults({
        total: 0,
        displayed: 0,
        results: [],
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-slate-200/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <Link to="/" className="group flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  SupKnowledge
                </span>
                <span className="block text-sm text-slate-600 font-medium -mt-1">Art Collection</span>
              </div>
            </Link>
            
            <button 
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className={`mt-4 md:mt-0 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0 md:opacity-100 md:max-h-none'} md:block overflow-hidden`}>
            <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
              <li>
                <Link 
                  to="/" 
                  className="group relative px-4 py-2 text-slate-700 hover:text-violet-600 transition-all duration-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accueil
                  <span className="absolute bottom-0 left-4 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 group-hover:w-4 transition-all duration-300"></span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/advanced-search" 
                  className="group relative px-4 py-2 text-slate-700 hover:text-violet-600 transition-all duration-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Recherche Avancée
                  <span className="absolute bottom-0 left-4 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 group-hover:w-16 transition-all duration-300"></span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-6">
          <form onSubmit={handleSearch} className="flex items-center max-w-2xl mx-auto">
            <div className="relative flex-grow group">
              <input
                type="text"
                placeholder="Rechercher dans la collection..."
                className="w-full py-4 pl-12 pr-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300 text-lg placeholder-slate-400 bg-white/80 backdrop-blur-sm shadow-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors duration-300" size={20} />
            </div>
            <button
              type="submit"
              disabled={searchIsLoading}
              className={`ml-4 px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-violet-500/25 transform hover:scale-105 flex items-center space-x-2 ${
                searchIsLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {searchIsLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Recherche...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default Header
