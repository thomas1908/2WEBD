"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useSearch } from "../context/SearchContext"
import { Search } from "lucide-react"

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const { setSearchResults, setIsLoading } = useSearch()
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      // First, search for object IDs
      const searchResponse = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${encodeURIComponent(searchQuery)}`,
      )
      const searchData = await searchResponse.json()

      if (searchData.objectIDs && searchData.objectIDs.length > 0) {
        // Limit to first 20 results for performance
        const limitedIds = searchData.objectIDs.slice(0, 20)

        // Fetch details for each object
        const objectPromises = limitedIds.map((id) =>
          fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then((res) => res.json()),
        )

        const objects = await Promise.all(objectPromises)
        setSearchResults({
          total: searchData.objectIDs.length,
          displayed: limitedIds.length,
          results: objects,
        })

        navigate("/search")
      } else {
        setSearchResults({
          total: 0,
          displayed: 0,
          results: [],
        })
        navigate("/search")
      }
    } catch (error) {
      console.error("Error searching objects:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              SupKnowledge <span className="text-emerald-600">Art Collection</span>
            </Link>
            <button className="md:hidden">{/* Mobile menu button would go here */}</button>
          </div>

          <nav className="mt-4 md:mt-0">
            <ul className="flex flex-col md:flex-row md:space-x-8 space-y-2 md:space-y-0">
              <li>
                <Link to="/" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/advanced-search" className="text-gray-600 hover:text-emerald-600 transition-colors">
                  Advanced Search
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-4">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search the collection..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}

export default Header
