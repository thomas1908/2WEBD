import { Link } from "react-router-dom"
import { Palette, ExternalLink } from "lucide-react"

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  SupKnowledge
                </span>
                <span className="block text-sm text-slate-400 font-medium -mt-1">Art Collection</span>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Offrir aux chercheurs et aux universitaires un accès facile à la vaste collection d'art du Musée MET à travers une interface moderne et intuitive.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="group flex items-center text-slate-300 hover:text-violet-400 transition-all duration-300"
                >
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  to="/advanced-search" 
                  className="group flex items-center text-slate-300 hover:text-violet-400 transition-all duration-300"
                >
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform duration-300"></span>
                  Recherche Avancée
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 text-white">À Propos</h3>
            <p className="text-slate-300 mb-4 leading-relaxed">
              Cette interface a été développée dans le cadre d'un projet pour SupKnowledge, utilisant l'API de la Collection du Metropolitan Museum of Art.
            </p>
            <a
              href="https://metmuseum.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center text-violet-400 hover:text-violet-300 transition-colors duration-300 font-medium"
            >
              <span>Documentation API</span>
              <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-slate-400 mb-4 md:mb-0">
              <span>&copy; {new Date().getFullYear()} SupKnowledge. Tous droits réservés.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Décoration en bas */}
      <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500"></div>
    </footer>
  )
}

export default Footer

