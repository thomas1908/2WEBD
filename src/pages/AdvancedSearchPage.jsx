"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSearch } from "../context/SearchContext"
import { Search, Filter, X } from "lucide-react"

const AdvancedSearchPage = () => {
  const navigate = useNavigate()
  const { setSearchResults, setIsLoading, isLoading } = useSearch()

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
  useState(() => {
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

      // Fetch search results
      const searchResponse = await fetch(queryUrl)
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
      console.error("Error performing advanced search:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Advanced Search</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search Query */}
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="q" className="block text-sm font-medium text-gray-700 mb-1">
                Search Query
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="q"
                  name="q"
                  value={searchParams.q}
                  onChange={handleInputChange}
                  placeholder="Enter keywords..."
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>

            {/* Department */}
            <div>
              <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="departmentId"
                name="departmentId"
                value={searchParams.departmentId}
                onChange={handleInputChange}
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                disabled={isLoadingDepartments}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  id="dateBegin"
                  name="dateBegin"
                  value={searchParams.dateBegin}
                  onChange={handleInputChange}
                  placeholder="From year..."
                  className="w-1/2 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  id="dateEnd"
                  name="dateEnd"
                  value={searchParams.dateEnd}
                  onChange={handleInputChange}
                  placeholder="To year..."
                  className="w-1/2 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <label htmlFor="medium" className="block text-sm font-medium text-gray-700 mb-1">
                Medium
              </label>
              <input
                type="text"
                id="medium"
                name="medium"
                value={searchParams.medium}
                onChange={handleInputChange}
                placeholder="e.g., Paintings, Sculpture, Ceramics..."
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Geographic Location */}
            <div>
              <label htmlFor="geoLocation" className="block text-sm font-medium text-gray-700 mb-1">
                Geographic Location
              </label>
              <input
                type="text"
                id="geoLocation"
                name="geoLocation"
                value={searchParams.geoLocation}
                onChange={handleInputChange}
                placeholder="e.g., France, Egypt, Asia..."
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={searchParams.tags}
                onChange={handleInputChange}
                placeholder="e.g., portrait, landscape, gold..."
                className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Checkboxes */}
            <div className="col-span-1 md:col-span-2 flex flex-wrap gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="artistOrCulture"
                  name="artistOrCulture"
                  checked={searchParams.artistOrCulture}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="artistOrCulture" className="ml-2 block text-sm text-gray-700">
                  Search artist or culture only
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasImages"
                  name="hasImages"
                  checked={searchParams.hasImages}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="hasImages" className="ml-2 block text-sm text-gray-700">
                  Only show results with images
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center"
              disabled={isLoading}
            >
              <X size={16} className="mr-1" />
              Reset
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Searching...
                </span>
              ) : (
                <span className="flex items-center">
                  <Filter size={16} className="mr-1" />
                  Search
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdvancedSearchPage
