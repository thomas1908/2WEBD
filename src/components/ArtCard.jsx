import { Link } from "react-router-dom"
import { Calendar, User, Tag, Eye, Heart, Share2 } from "lucide-react"
import { useState, useEffect } from "react"

const ArtCard = ({ item }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  
  // Gérer l'image manquante
  const imageUrl = item.primaryImageSmall || item.primaryImage || "/placeholder.svg?height=300&width=300"

  useEffect(() => {
    if (item.objectID) {
      const favorites = JSON.parse(localStorage.getItem('metFavorites') || '[]')
      setIsFavorited(favorites.includes(item.objectID.toString()))
    }
  }, [item.objectID])

  // Gérer les favoris
  const handleFavoriteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const favorites = JSON.parse(localStorage.getItem('metFavorites') || '[]')
    const objectIdStr = item.objectID.toString()
    
    if (isFavorited) {
      // Retirer des favoris
      const updatedFavorites = favorites.filter(id => id !== objectIdStr)
      localStorage.setItem('metFavorites', JSON.stringify(updatedFavorites))
      setIsFavorited(false)
    } else {
      // Ajouter aux favoris
      const updatedFavorites = [...favorites, objectIdStr]
      localStorage.setItem('metFavorites', JSON.stringify(updatedFavorites))
      setIsFavorited(true)
    }
  }

  // Gérer le partage
  const handleShareClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const shareData = {
      title: item.title || 'Œuvre d\'art du MET',
      text: `Découvrez cette œuvre: ${item.title} par ${item.artistDisplayName || 'Artiste inconnu'}`,
      url: `${window.location.origin}/object/${item.objectID}`
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.url)
        alert('Lien copié dans le presse-papiers!')
      }
    } catch (error) {
      console.error('Erreur lors du partage:', error)
    }
  }

  return (
    <Link to={`/object/${item.objectID}`} className="group block">
      <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-2 border border-slate-100">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={item.title || "Artwork"}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              setImageError(true)
              setImageLoaded(true)
              e.target.src = "/placeholder.svg?height=300&width=300"
            }}
          />
          
          {/* Overlay avec effet de gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Boutons d'action en haut à droite */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button 
                onClick={handleFavoriteClick}
                className={`p-2 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
                  isFavorited 
                    ? 'bg-red-500/80 text-white' 
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
                title={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={handleShareClick}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/30 transition-all duration-300 hover:scale-110 text-white"
                title="Partager cette œuvre"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
            
            {/* Information en bas */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center justify-between">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-medium">Voir les détails</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-violet-600 transition-colors duration-300 mb-3 leading-tight">
            {item.title || "Sans titre"}
          </h3>

          <div className="space-y-3">
            {item.artistDisplayName && (
              <div className="flex items-center text-slate-600 group/item hover:text-violet-600 transition-colors duration-300">
                <div className="p-1.5 bg-violet-100 rounded-lg mr-3 group-hover/item:bg-violet-200 transition-colors duration-300">
                  <User size={14} className="text-violet-600" />
                </div>
                <span className="text-sm font-medium truncate">{item.artistDisplayName}</span>
              </div>
            )}

            {item.objectDate && (
              <div className="flex items-center text-slate-600 group/item hover:text-violet-600 transition-colors duration-300">
                <div className="p-1.5 bg-purple-100 rounded-lg mr-3 group-hover/item:bg-purple-200 transition-colors duration-300">
                  <Calendar size={14} className="text-purple-600" />
                </div>
                <span className="text-sm font-medium">{item.objectDate}</span>
              </div>
            )}

            {item.department && (
              <div className="flex items-center text-slate-600 group/item hover:text-violet-600 transition-colors duration-300">
                <div className="p-1.5 bg-indigo-100 rounded-lg mr-3 group-hover/item:bg-indigo-200 transition-colors duration-300">
                  <Tag size={14} className="text-indigo-600" />
                </div>
                <span className="text-sm font-medium truncate">{item.department}</span>
              </div>
            )}
          </div>
          
          {/* Culture ou Medium en badge si disponible */}
          <div className="mt-4 flex flex-wrap gap-2">
            {item.culture && (
              <span className="inline-block bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 text-xs px-3 py-1 rounded-full font-medium">
                {item.culture}
              </span>
            )}
            {item.medium && item.medium.length < 30 && (
              <span className="inline-block bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                {item.medium}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ArtCard
