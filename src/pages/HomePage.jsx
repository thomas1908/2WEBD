"use client"

import { useState, useEffect } from "react"
import ArtCard from "../components/ArtCard"
import LoadingSpinner from "../components/LoadingSpinner"

const HomePage = () => {
  const [highlights, setHighlights] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHighlights = async () => {
      setIsLoading(true)
      try {
        // The MET API doesn't have a direct endpoint for highlights,
        // so we'll use a curated list of object IDs that are considered highlights
        // In a real application, this would come from a dedicated API endpoint
        const highlightIds = [
          436535, // Van Gogh's Self-Portrait with a Straw Hat
          459088, // Monet's Bridge over a Pond of Water Lilies
          437133, // Vermeer's Young Woman with a Water Pitcher
          438814, // Rembrandt's Self-Portrait
          436965, // Degas' The Dance Class
          435809, // The Great Wave off Kanagawa
          11417, // Egyptian Cat Statue
          544730, // Armor
          435882, // Washington Crossing the Delaware
          436282, // Wheat Field with Cypresses
          436973, // Rodin's The Thinker
          437980, // Tiffany Lamp
        ]

        const objectPromises = highlightIds.map((id) =>
          fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch object ${id}`)
            return res.json()
          }),
        )

        const objects = await Promise.all(objectPromises)
        setHighlights(objects.filter((obj) => obj.primaryImage)) // Filter out objects without images
      } catch (error) {
        console.error("Error fetching highlights:", error)
        setError("Failed to load highlighted artworks. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHighlights()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white rounded-lg p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-4">Explore the MET Museum Collection</h1>
          <p className="text-xl max-w-2xl">
            Discover thousands of artworks from around the world, spanning over 5,000 years of human creativity.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Highlighted Artworks</h2>

        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {highlights.map((item) => (
              <ArtCard key={item.objectID} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default HomePage
