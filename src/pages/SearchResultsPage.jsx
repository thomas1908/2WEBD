import { useSearch } from "../context/SearchContext"
import ArtCard from "../components/ArtCard"
import LoadingSpinner from "../components/LoadingSpinner"

const SearchResultsPage = () => {
  const { searchResults, isLoading } = useSearch()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Search Results</h1>

      <p className="text-gray-600 mb-6">
        {searchResults.total > 0
          ? `Showing ${searchResults.displayed} of ${searchResults.total} results`
          : "No results found. Try adjusting your search criteria."}
      </p>

      {searchResults.total > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.results.map((item) => (
            <ArtCard key={item.objectID} item={item} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-lg text-gray-700">No artworks match your search criteria.</p>
          <p className="mt-2 text-gray-600">Try using different keywords or filters.</p>
        </div>
      )}
    </div>
  )
}

export default SearchResultsPage
