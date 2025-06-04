"use client"

import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import { 
  Calendar, 
  MapPin, 
  User, 
  Tag, 
  Bookmark, 
  ExternalLink, 
  ArrowLeft, 
  Info,
  Building2,
  Palette,
  Maximize2,
  Share2,
  Heart,
  X
} from "lucide-react"

const ItemDetailPage = () => {
  const { objectId } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isImageExpanded, setIsImageExpanded] = useState(false)

  // Scroll vers le haut quand la page se charge ou change d'objet
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }, [objectId])

  // Vérifier si l'item est en favoris au chargement
  useEffect(() => {
    if (objectId) {
      const favorites = JSON.parse(localStorage.getItem('metFavorites') || '[]')
      setIsFavorited(favorites.includes(objectId))
    }
  }, [objectId])

  useEffect(() => {
    const fetchObjectDetails = async () => {
      setLoading(true)
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
        setLoading(false)
      }
    }

    fetchObjectDetails()
  }, [objectId])

  // Gérer les favoris
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('metFavorites') || '[]')
    
    if (isFavorited) {
      // Retirer des favoris
      const updatedFavorites = favorites.filter(id => id !== objectId)
      localStorage.setItem('metFavorites', JSON.stringify(updatedFavorites))
      setIsFavorited(false)
      console.log(`Retiré des favoris: ${item?.title}`)
    } else {
      // Ajouter aux favoris
      const updatedFavorites = [...favorites, objectId]
      localStorage.setItem('metFavorites', JSON.stringify(updatedFavorites))
      setIsFavorited(true)
      console.log(`Ajouté aux favoris: ${item?.title}`)
    }
  }

  // Gérer le partage
  const shareArtwork = async () => {
    const shareData = {
      title: item?.title || 'Œuvre d\'art du MET',
      text: `Découvrez cette œuvre: ${item?.title} par ${item?.artistDisplayName || 'Artiste inconnu'}`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback: copier l'URL dans le presse-papiers
        await navigator.clipboard.writeText(window.location.href)
        alert('Lien copié dans le presse-papiers!')
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error)
    }
  }

  // Gérer l'agrandissement d'image
  const expandImage = () => {
    setIsImageExpanded(true)
  }

  const closeExpandedImage = () => {
    setIsImageExpanded(false)
  }

  // Gérer le retour intelligent
  const handleGoBack = () => {
    // Vérifier si on peut retourner en arrière
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      // Si pas d'historique, aller à l'accueil
      navigate('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl">
              <Palette className="w-12 h-12 text-violet-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Chargement de l'œuvre d'art...
          </h2>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl">
                <Info className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Erreur de chargement
            </h3>
            <p className="text-slate-600 mb-6">
              {error || "Impossible de charger les détails de l'œuvre d'art"}
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold hover:from-violet-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const allImages = item.primaryImage ? [item.primaryImage, ...(item.additionalImages || [])] : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      {/* Header Navigation */}
      <div className="container mx-auto px-4 py-6">
        <button 
          onClick={handleGoBack}
          className="group inline-flex items-center text-violet-600 hover:text-violet-700 transition-all duration-300 font-medium"
        >
          <div className="p-2 bg-white rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 mr-3">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Retour aux résultats
        </button>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Image Section */}
            <div className="space-y-6">
              {allImages.length > 0 ? (
                <>
                  {/* Main Image */}
                  <div className="bg-white rounded-3xl shadow-xl p-6 border border-slate-200">
                    <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden">
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <LoadingSpinner size="medium" />
                        </div>
                      )}
                      <img
                        src={allImages[selectedImage] || "/placeholder.svg"}
                        alt={item.title || "Artwork"}
                        className={`w-full h-auto max-h-[70vh] object-contain transition-opacity duration-500 ${
                          imageLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=600&width=800"
                          setImageLoaded(true)
                        }}
                      />
                      
                      {/* Image Actions */}
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <button 
                          onClick={expandImage}
                          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                          title="Agrandir l'image"
                        >
                          <Maximize2 className="w-4 h-4 text-slate-700" />
                        </button>
                        <button 
                          onClick={shareArtwork}
                          className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
                          title="Partager cette œuvre"
                        >
                          <Share2 className="w-4 h-4 text-slate-700" />
                        </button>
                        <button 
                          onClick={toggleFavorite}
                          className={`p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 ${
                            isFavorited ? 'text-red-500' : 'text-slate-700'
                          }`}
                          title={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
                        >
                          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnail Gallery */}
                  {allImages.length > 1 && (
                    <div className="bg-white rounded-3xl shadow-lg p-4 border border-slate-200">
                      <div className="flex space-x-3 overflow-x-auto">
                        {allImages.map((imgUrl, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedImage(index)
                              setImageLoaded(false)
                            }}
                            className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                              selectedImage === index 
                                ? 'border-violet-500 shadow-lg scale-105' 
                                : 'border-slate-200 hover:border-violet-300'
                            }`}
                          >
                            <img
                              src={imgUrl || "/placeholder.svg"}
                              alt={`${item.title || "Artwork"} - vue ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg?height=100&width=100"
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white rounded-3xl shadow-xl p-12 border border-slate-200 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
                      <Palette className="w-12 h-12 text-slate-400" />
                    </div>
                  </div>
                  <p className="text-slate-600">Aucune image disponible pour cette œuvre</p>
                </div>
              )}
            </div>

            {/* Information Section */}
            <div className="space-y-6">
              
              {/* Title and Artist */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
                <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                  {item.title || "Sans titre"}
                </h1>
                
                {item.artistDisplayName && (
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl">
                      <User className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-slate-700">
                        {item.artistDisplayName}
                      </h2>
                      {item.artistDisplayBio && (
                        <p className="text-slate-500 text-sm">{item.artistDisplayBio}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Culture and Period Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.culture && (
                    <span className="px-4 py-2 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-full text-sm font-medium">
                      {item.culture}
                    </span>
                  )}
                  {item.period && (
                    <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 rounded-full text-sm font-medium">
                      {item.period}
                    </span>
                  )}
                  {item.department && (
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium">
                      {item.department}
                    </span>
                  )}
                </div>
              </div>

              {/* Artwork Details */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
                    <Info className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Détails de l'œuvre</h3>
                </div>

                <div className="space-y-4">
                  {item.objectDate && (
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-violet-50 rounded-2xl">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Calendar className="w-4 h-4 text-violet-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Date :</span>
                        <p className="text-slate-600">{item.objectDate}</p>
                        {item.objectBeginDate && item.objectEndDate && item.objectBeginDate !== item.objectEndDate && (
                          <p className="text-slate-500 text-sm">
                            ({item.objectBeginDate} - {item.objectEndDate})
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {item.medium && (
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-purple-50 rounded-2xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Tag className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Technique :</span>
                        <p className="text-slate-600">{item.medium}</p>
                      </div>
                    </div>
                  )}

                  {(item.dimensions || item.measurements) && (
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl">
                      <div className="p-2 bg-indigo-100 rounded-lg">
                        <Bookmark className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Dimensions :</span>
                        <p className="text-slate-600">{item.dimensions || item.measurements}</p>
                      </div>
                    </div>
                  )}

                  {(item.geographyType || item.city || item.state || item.county || item.country) && (
                    <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-slate-50 to-emerald-50 rounded-2xl">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">Géographie :</span>
                        <p className="text-slate-600">
                          {[item.geographyType, item.city, item.state, item.county, item.country]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Museum Information */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Informations muséales</h3>
                </div>

                <div className="space-y-4">
                  {item.accessionNumber && (
                    <div className="flex justify-between py-3 border-b border-slate-100">
                      <span className="font-medium text-slate-600">Numéro d'accession :</span>
                      <span className="text-slate-800">{item.accessionNumber}</span>
                    </div>
                  )}

                  {item.creditLine && (
                    <div className="py-3 border-b border-slate-100">
                      <span className="font-medium text-slate-600 block mb-2">Ligne de crédit :</span>
                      <span className="text-slate-800 text-sm">{item.creditLine}</span>
                    </div>
                  )}

                  {item.repository && (
                    <div className="flex justify-between py-3">
                      <span className="font-medium text-slate-600">Dépôt :</span>
                      <span className="text-slate-800">{item.repository}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {item.objectDescription && (
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Description</h3>
                  <p className="text-slate-600 leading-relaxed">{item.objectDescription}</p>
                </div>
              )}

              {/* External Link */}
              {item.objectURL && (
                <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                  <h3 className="text-xl font-bold mb-4">Voir plus</h3>
                  <p className="mb-6 opacity-90">
                    Découvrez plus d'informations sur cette œuvre sur le site officiel du MET Museum
                  </p>
                  <a
                    href={item.objectURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-white text-violet-600 rounded-2xl font-semibold hover:bg-slate-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Site du MET Museum
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'agrandissement d'image */}
      {isImageExpanded && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeExpandedImage}>
          <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeExpandedImage}
              className="absolute top-4 right-4 z-10 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
              title="Fermer"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <img
              src={allImages[selectedImage] || "/placeholder.svg"}
              alt={item?.title || "Artwork"}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: '90vh', maxWidth: '90vw' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ItemDetailPage
