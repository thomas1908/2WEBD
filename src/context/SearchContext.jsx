"use client"

import { createContext, useContext, useState } from "react"

const SearchContext = createContext()

export const useSearch = () => useContext(SearchContext)

export const SearchProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState({
    total: 0,
    displayed: 0,
    results: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [advancedSearchParams, setAdvancedSearchParams] = useState({})
  const [currentSearchQuery, setCurrentSearchQuery] = useState("")
  const [allObjectIds, setAllObjectIds] = useState([])

  const loadMoreResults = async () => {
    if (isLoadingMore || searchResults.displayed >= searchResults.total) return

    setIsLoadingMore(true)
    
    try {
      // Calculer quels IDs charger ensuite
      const startIndex = searchResults.displayed
      const endIndex = Math.min(startIndex + 20, allObjectIds.length)
      const idsToLoad = allObjectIds.slice(startIndex, endIndex)

      // Charger les détails pour ces objets
      const objectPromises = idsToLoad.map((id) =>
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
          .then((res) => res.json())
          .catch(() => null) // Gérer les erreurs individuelles
      )

      const newObjects = await Promise.all(objectPromises)
      const validObjects = newObjects.filter(obj => obj && obj.primaryImage)

      // Ajouter les nouveaux résultats aux existants
      setSearchResults(prev => ({
        ...prev,
        displayed: endIndex,
        results: [...prev.results, ...validObjects]
      }))

    } catch (error) {
      console.error("Error loading more results:", error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        isLoading,
        setIsLoading,
        isLoadingMore,
        setIsLoadingMore,
        advancedSearchParams,
        setAdvancedSearchParams,
        currentSearchQuery,
        setCurrentSearchQuery,
        allObjectIds,
        setAllObjectIds,
        loadMoreResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
