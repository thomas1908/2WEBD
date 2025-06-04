import { useSearch } from "../context/SearchContext"
import { useLocation } from "react-router-dom"
import { useEffect, useCallback } from "react"
import ArtCard from "../components/ArtCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { Search, AlertCircle, ChevronDown } from "lucide-react"

const SearchResultsPage = () => {
  const { searchResults, isLoading, isLoadingMore, loadMoreResults } = useSearch()
  const location = useLocation()
  
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get('q') || ''

  // Scroll vers le haut quand la page se charge ou change de recherche
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [searchQuery])

  // Hook pour détecter le scroll en bas de page
  const handleScroll = useCallback(() => {
    if (isLoadingMore || isLoading) return

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement
    
    if (scrollTop + clientHeight >= scrollHeight - 200) {
      loadMoreResults()
    }
  }, [isLoadingMore, isLoading, loadMoreResults])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const hasMoreResults = searchResults.displayed < searchResults.total

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-slate-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl">
                  <Search className="w-8 h-8 text-violet-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Recherche en cours...
              </h2>
              {searchQuery && (
                <p className="text-slate-600 mb-6">
                  Recherche de "<span className="font-semibold text-violet-600">{searchQuery}</span>"
                </p>
              )}
              <LoadingSpinner />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header des résultats */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-slate-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                  Résultats de recherche
                </h1>
                {searchQuery && (
                  <p className="text-lg text-slate-600 mt-1">
                    pour "<span className="font-semibold text-violet-600">{searchQuery}</span>"
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                {searchResults.total > 0
                  ? `${searchResults.results.length} sur ${searchResults.total} œuvres affichées`
                  : "Aucun résultat trouvé"}
              </p>
              
              {hasMoreResults && (
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-r from-violet-100 to-purple-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-violet-700">
                      {searchResults.total - searchResults.results.length} autres œuvres disponibles
                    </span>
                  </div>
                  <div className="flex items-center text-violet-600 animate-bounce">
                    <ChevronDown className="w-4 h-4" />
                    <span className="text-xs ml-1">Scroll</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Résultats */}
          {searchResults.total > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {searchResults.results.map((item, index) => (
                  <div 
                    key={item.objectID}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ArtCard item={item} />
                  </div>
                ))}
              </div>

              {/* Indicateur de chargement en bas */}
              {isLoadingMore && (
                <div className="mt-12 flex justify-center">
                  <div className="bg-white rounded-3xl shadow-lg px-8 py-6 border border-slate-200">
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="medium" text="" />
                      <div>
                        <p className="text-lg font-semibold text-slate-800">
                          Chargement de plus d'œuvres...
                        </p>
                        <p className="text-sm text-slate-600">
                          Découvrez encore plus de trésors artistiques
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Message de fin si tous les résultats sont chargés */}
              {!hasMoreResults && searchResults.results.length > 20 && (
                <div className="mt-12 text-center">
                  <div className="bg-white rounded-3xl shadow-lg px-8 py-6 border border-slate-200 inline-block">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                        <Search className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-slate-800">
                          Tous les résultats ont été chargés !
                        </p>
                        <p className="text-sm text-slate-600">
                          {searchResults.results.length} œuvres trouvées au total
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-slate-200">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl">
                  <AlertCircle className="w-12 h-12 text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Aucune œuvre trouvée
              </h3>
              <p className="text-lg text-slate-600 mb-6 max-w-md mx-auto">
                Essayez d'ajuster vos critères de recherche ou utilisez des mots-clés différents.
              </p>
              <div className="space-y-2 text-sm text-slate-500">
                <p>• Vérifiez l'orthographe de vos mots-clés</p>
                <p>• Essayez des termes plus généraux</p>
                <p>• Utilisez des mots en anglais pour de meilleurs résultats</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage
