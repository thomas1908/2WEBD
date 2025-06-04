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
  const [advancedSearchParams, setAdvancedSearchParams] = useState({})

  return (
    <SearchContext.Provider
      value={{
        searchResults,
        setSearchResults,
        isLoading,
        setIsLoading,
        advancedSearchParams,
        setAdvancedSearchParams,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
