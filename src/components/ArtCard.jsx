import { Link } from "react-router-dom"
import { Calendar, User, Tag } from "lucide-react"

const ArtCard = ({ item }) => {
  // Handle missing image
  const imageUrl = item.primaryImageSmall || item.primaryImage || "/placeholder.svg?height=300&width=300"

  return (
    <Link to={`/object/${item.objectID}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-64 overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={item.title || "Artwork"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=300&width=300"
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {item.title || "Untitled"}
          </h3>

          <div className="mt-2 space-y-1">
            {item.artistDisplayName && (
              <div className="flex items-center text-sm text-gray-600">
                <User size={16} className="mr-1" />
                <span>{item.artistDisplayName}</span>
              </div>
            )}

            {item.objectDate && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar size={16} className="mr-1" />
                <span>{item.objectDate}</span>
              </div>
            )}

            {item.department && (
              <div className="flex items-center text-sm text-gray-600">
                <Tag size={16} className="mr-1" />
                <span>{item.department}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ArtCard
