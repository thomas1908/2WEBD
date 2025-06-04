"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import LoadingSpinner from "../components/LoadingSpinner"
import { Calendar, MapPin, User, Tag, Bookmark, ExternalLink, ArrowLeft } from "lucide-react"

const ItemDetailPage = () => {
  const { objectId } = useParams()
  const [item, setItem] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchObjectDetails = async () => {
      setIsLoading(true)
      try {
        if (!objectId) {
          throw new Error("No object ID provided")
        }

        const response = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch object details: ${response.status}`)
        }

        const data = await response.json()
        setItem(data)
      } catch (error) {
        console.error("Error fetching object details:", error)
        setError(error.message || "Failed to load artwork details")
      } finally {
        setIsLoading(false)
      }
    }

    fetchObjectDetails()
  }, [objectId])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error || !item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error || "Failed to load artwork details"}</p>
          <Link to="/" className="mt-2 inline-block text-red-700 underline">
            Return to homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-emerald-600 hover:text-emerald-800 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to search
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Image Section */}
        {item.primaryImage && (
          <div className="relative bg-gray-100 flex justify-center">
            <img
              src={item.primaryImage || "/placeholder.svg"}
              alt={item.title || "Artwork"}
              className="max-h-[70vh] object-contain"
              onError={(e) => {
                e.target.src = "/placeholder.svg?height=600&width=800"
              }}
            />
          </div>
        )}

        {/* Content Section */}
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.title || "Untitled"}</h1>

          {item.artistDisplayName && (
            <h2 className="text-xl text-gray-600 mb-4">
              by {item.artistDisplayName}
              {item.artistDisplayBio && ` (${item.artistDisplayBio})`}
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Artwork Details</h3>

              <div className="space-y-3">
                {item.objectDate && (
                  <div className="flex items-start">
                    <Calendar size={18} className="mr-2 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Date: </span>
                      <span>{item.objectDate}</span>
                      {item.objectBeginDate && item.objectEndDate && item.objectBeginDate !== item.objectEndDate && (
                        <span className="text-gray-500 text-sm ml-1">
                          ({item.objectBeginDate} - {item.objectEndDate})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {item.medium && (
                  <div className="flex items-start">
                    <Tag size={18} className="mr-2 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Medium: </span>
                      <span>{item.medium}</span>
                    </div>
                  </div>
                )}

                {(item.dimensions || item.measurements) && (
                  <div className="flex items-start">
                    <Bookmark size={18} className="mr-2 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Dimensions: </span>
                      <span>{item.dimensions || item.measurements}</span>
                    </div>
                  </div>
                )}

                {(item.culture || item.period) && (
                  <div className="flex items-start">
                    <User size={18} className="mr-2 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Culture/Period: </span>
                      <span>{item.culture || item.period}</span>
                    </div>
                  </div>
                )}

                {(item.geographyType || item.city || item.state || item.county || item.country) && (
                  <div className="flex items-start">
                    <MapPin size={18} className="mr-2 text-emerald-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-medium">Geography: </span>
                      <span>
                        {[item.geographyType, item.city, item.state, item.county, item.country]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Museum Information</h3>

              <div className="space-y-3">
                {item.department && (
                  <div>
                    <span className="font-medium">Department: </span>
                    <span>{item.department}</span>
                  </div>
                )}

                {item.accessionNumber && (
                  <div>
                    <span className="font-medium">Accession Number: </span>
                    <span>{item.accessionNumber}</span>
                  </div>
                )}

                {item.creditLine && (
                  <div>
                    <span className="font-medium">Credit Line: </span>
                    <span>{item.creditLine}</span>
                  </div>
                )}

                {item.repository && (
                  <div>
                    <span className="font-medium">Repository: </span>
                    <span>{item.repository}</span>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {item.additionalImages && item.additionalImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Additional Images</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {item.additionalImages.slice(0, 6).map((imgUrl, index) => (
                      <a
                        key={index}
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block h-24 overflow-hidden rounded border border-gray-200"
                      >
                        <img
                          src={imgUrl || "/placeholder.svg"}
                          alt={`${item.title || "Artwork"} - view ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg?height=100&width=100"
                          }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description or Additional Info */}
          {item.objectDescription && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Description</h3>
              <p className="text-gray-700">{item.objectDescription}</p>
            </div>
          )}

          {/* External Link */}
          {item.objectURL && (
            <div className="mt-8">
              <a
                href={item.objectURL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <ExternalLink size={16} className="mr-2" />
                View on MET Museum Website
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemDetailPage
