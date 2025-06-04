"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useSearch } from "../context/SearchContext"
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  MapPin,
  Tag,
  Palette,
  Building,
  Globe,
  Sparkles,
  ArrowRight
} from "lucide-react"

const AdvancedSearchPage = () => {
  const navigate = useNavigate()
  const { setSearchResults, setIsLoading, isLoading, setCurrentSearchQuery, setAllObjectIds } = useSearch()

  const [searchParams, setSearchParams] = useState({
    q: "",
    departmentId: "",
    dateBegin: "",
    dateEnd: "",
    artistOrCulture: false,
    medium: "",
    hasImages: true,
    geoLocation: "",
    tags: "",
  })

  const [departments, setDepartments] = useState([])
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false)

  // Fetch departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoadingDepartments(true)
      try {
        const response = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
        const data = await response.json()
        setDepartments(data.departments || [])
      } catch (error) {
        console.error("Error fetching departments:", error)
      } finally {
        setIsLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSearchParams({
      ...searchParams,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleReset = () => {
    setSearchParams({
      q: "",
      departmentId: "",
      dateBegin: "",
      dateEnd: "",
      artistOrCulture: false,
      medium: "",
      hasImages: true,
      geoLocation: "",
      tags: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setCurrentSearchQuery(searchParams.q || "recherche avancée")

    try {
      // Build the query URL
      let queryUrl = "https://collectionapi.metmuseum.org/public/collection/v1/search?"

      // Add search parameters
      const params = new URLSearchParams()

      if (searchParams.q) {
        params.append("q", searchParams.q)
      }

      if (searchParams.departmentId) {
        params.append("departmentId", searchParams.departmentId)
      }

      if (searchParams.artistOrCulture) {
        params.append("artistOrCulture", "true")
      }

      if (searchParams.dateBegin) {
        params.append("dateBegin", searchParams.dateBegin)
      }

      if (searchParams.dateEnd) {
        params.append("dateEnd", searchParams.dateEnd)
      }

      if (searchParams.medium) {
        params.append("medium", searchParams.medium)
      }

      if (searchParams.hasImages) {
        params.append("hasImages", "true")
      }

      if (searchParams.geoLocation) {
        params.append("geoLocation", searchParams.geoLocation)
      }

      if (searchParams.tags) {
        params.append("tags", searchParams.tags)
      }

      // If no search parameters, use a default search
      if (params.toString() === "") {
        params.append("hasImages", "true")
      }

      queryUrl += params.toString()

      // Navigate immediately to search page
      navigate(`/search?${params.toString()}`)

      // Fetch search results
      const searchResponse = await fetch(queryUrl)
      const searchData = await searchResponse.json()

      if (searchData.objectIDs && searchData.objectIDs.length > 0) {
        // Store all IDs for infinite loading
        setAllObjectIds(searchData.objectIDs)
        
        // Limit to first 20 results for performance
        const limitedIds = searchData.objectIDs.slice(0, 20)

        // Fetch details for each object
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
      console.error("Error performing advanced search:", error)
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

  const popularSearches = [
    { label: "Peintures", query: "paintings", icon: <Palette className="w-4 h-4" /> },
    { label: "Sculptures", query: "sculpture", icon: <Building className="w-4 h-4" /> },
    { label: "Art égyptien", query: "egyptian", icon: <Globe className="w-4 h-4" /> },
    { label: "Impressionnisme", query: "impressionist", icon: <Sparkles className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-xl">
                <Filter className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Recherche Avancée
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Affinez votre recherche avec des critères spécifiques pour découvrir des œuvres d'art exceptionnelles
            </p>
          </div>

          {/* Popular Searches */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recherches populaires</h3>
            <div className="flex flex-wrap gap-3">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => setSearchParams(prev => ({ ...prev, q: search.query }))}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-full hover:from-violet-200 hover:to-purple-200 transition-all duration-300 transform hover:scale-105"
                >
                  {search.icon}
                  <span className="text-sm font-medium">{search.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <form onSubmit={handleSubmit} className="p-8">
              
              {/* Search Query Section */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Terme de recherche</h3>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    id="q"
                    name="q"
                    value={searchParams.q}
                    onChange={handleInputChange}
                    placeholder="Saisissez vos mots-clés (ex: Van Gogh, portrait, landscape)..."
                    className="w-full py-4 pl-12 pr-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300 text-lg placeholder-slate-400"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Department */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                      <Building className="w-4 h-4 text-indigo-600" />
                    </div>
                    <label htmlFor="departmentId" className="text-lg font-semibold text-slate-800">
                      Département
                    </label>
                  </div>
                  <select
                    id="departmentId"
                    name="departmentId"
                    value={searchParams.departmentId}
                    onChange={handleInputChange}
                    className="w-full py-3 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                    disabled={isLoadingDepartments}
                  >
                    <option value="">Tous les départements</option>
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                    </div>
                    <label className="text-lg font-semibold text-slate-800">Période</label>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      id="dateBegin"
                      name="dateBegin"
                      value={searchParams.dateBegin}
                      onChange={handleInputChange}
                      placeholder="Année de début"
                      className="py-3 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                    />
                    <input
                      type="number"
                      id="dateEnd"
                      name="dateEnd"
                      value={searchParams.dateEnd}
                      onChange={handleInputChange}
                      placeholder="Année de fin"
                      className="py-3 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Medium */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                      <Palette className="w-4 h-4 text-purple-600" />
                    </div>
                    <label htmlFor="medium" className="text-lg font-semibold text-slate-800">
                      Technique / Matériau
                    </label>
                  </div>
                  <input
                    type="text"
                    id="medium"
                    name="medium"
                    value={searchParams.medium}
                    onChange={handleInputChange}
                    placeholder="ex: Oil on canvas, Bronze, Watercolor..."
                    className="w-full py-3 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                  />
                </div>

                {/* Geographic Location */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <label htmlFor="geoLocation" className="text-lg font-semibold text-slate-800">
                      Origine géographique
                    </label>
                  </div>
                  <input
                    type="text"
                    id="geoLocation"
                    name="geoLocation"
                    value={searchParams.geoLocation}
                    onChange={handleInputChange}
                    placeholder="ex: France, Egypt, Asia, Rome..."
                    className="w-full py-3 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="mt-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
                    <Tag className="w-4 h-4 text-orange-600" />
                  </div>
                  <label htmlFor="tags" className="text-lg font-semibold text-slate-800">
                    Mots-clés spécifiques
                  </label>
                </div>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={searchParams.tags}
                  onChange={handleInputChange}
                  placeholder="ex: portrait, landscape, gold, religious..."
                  className="w-full py-3 px-4 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all duration-300"
                />
              </div>

              {/* Checkboxes */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Options de recherche</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-violet-50 rounded-2xl cursor-pointer hover:from-violet-50 hover:to-purple-50 transition-all duration-300">
                    <input
                      type="checkbox"
                      id="artistOrCulture"
                      name="artistOrCulture"
                      checked={searchParams.artistOrCulture}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-violet-600 bg-white border-2 border-slate-300 rounded focus:ring-violet-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-700 font-medium">
                      Rechercher uniquement l'artiste ou la culture
                    </span>
                  </label>

                  <label className="flex items-center p-4 bg-gradient-to-r from-slate-50 to-violet-50 rounded-2xl cursor-pointer hover:from-violet-50 hover:to-purple-50 transition-all duration-300">
                    <input
                      type="checkbox"
                      id="hasImages"
                      name="hasImages"
                      checked={searchParams.hasImages}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-violet-600 bg-white border-2 border-slate-300 rounded focus:ring-violet-500 focus:ring-2"
                    />
                    <span className="ml-3 text-slate-700 font-medium">
                      Afficher uniquement les œuvres avec images
                    </span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-4 border-2 border-slate-300 rounded-2xl text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 font-semibold flex items-center justify-center"
                  disabled={isLoading}
                >
                  <X className="w-5 h-5 mr-2" />
                  Réinitialiser
                </button>
                
                <button
                  type="submit"
                  className={`px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center ${
                    isLoading ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Recherche en cours...
                    </>
                  ) : (
                    <>
                      <Filter className="w-5 h-5 mr-2" />
                      Lancer la recherche
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4">💡 Conseils de recherche</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>• Utilisez l'anglais :</strong> Les termes en anglais donnent de meilleurs résultats
              </div>
              <div>
                <strong>• Soyez spécifique :</strong> "Van Gogh sunflowers" plutôt que "flower"
              </div>
              <div>
                <strong>• Explorez les périodes :</strong> Filtrez par siècle pour des résultats ciblés
              </div>
              <div>
                <strong>• Combinez les filtres :</strong> Utilisez plusieurs critères pour affiner
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSearchPage
