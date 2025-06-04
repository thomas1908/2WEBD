"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ArtCard from "../components/ArtCard"
import LoadingSpinner from "../components/LoadingSpinner"
import { Sparkles, ArrowRight, TrendingUp, Users, Globe } from "lucide-react"

const HomePage = () => {
  const [highlights, setHighlights] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHighlights = async () => {
      setIsLoading(true)
      try {
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
        setHighlights(objects.filter((obj) => obj.primaryImage))
      } catch (error) {
        console.error("Error fetching highlights:", error)
        setError("Failed to load highlighted artworks. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchHighlights()
  }, [])

  const stats = [
    { icon: <TrendingUp className="w-6 h-6" />, label: "Œuvres d'art", value: "5000+" },
    { icon: <Users className="w-6 h-6" />, label: "Artistes", value: "2000+" },
    { icon: <Globe className="w-6 h-6" />, label: "Cultures", value: "150+" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-purple-900/10 to-indigo-900/20"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-violet-500 to-purple-500 p-4 rounded-2xl shadow-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Explorez le Musée MET
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez des milliers d'œuvres d'art du monde entier, couvrant plus de 5 000 ans de créativité humaine dans une interface moderne et intuitive.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => {
                  const highlightsSection = document.querySelector('#highlights-section');
                  highlightsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold shadow-xl hover:shadow-violet-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Commencer l'exploration</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              
              <Link 
                to="/advanced-search"
                className="px-8 py-4 border-2 border-violet-200 text-violet-600 rounded-2xl font-semibold hover:bg-violet-50 transition-all duration-300 transform hover:scale-105 inline-block text-center"
              >
                Recherche avancée
              </Link>
            </div>
          </div>
        </div>
        
        {/* Elements flottants */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-violet-300 to-purple-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-to-br from-purple-300 to-indigo-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-indigo-300 to-violet-300 rounded-full opacity-20 animate-ping"></div>
      </section>

      {/* Section des stats */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg group-hover:shadow-violet-500/25 transition-all duration-300 transform group-hover:scale-110">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section oeuvre highlight */}
      <section id="highlights-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Œuvres d'art remarquables
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Une sélection soigneusement choisie des plus belles pièces de la collection
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-2xl text-center shadow-lg">
              <div className="font-semibold mb-2">Erreur de chargement</div>
              <div className="text-sm">{error}</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {highlights.map((item, index) => (
                <div 
                  key={item.objectID}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ArtCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
