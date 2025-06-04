import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">SupKnowledge Art Collection</h3>
            <p className="text-gray-300">
              Providing researchers and academics with easy access to the MET Museum's extensive art collection.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/advanced-search" className="text-gray-300 hover:text-emerald-400 transition-colors">
                  Advanced Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">About</h3>
            <p className="text-gray-300">
              This interface was developed as part of a project for SupKnowledge, utilizing the Metropolitan Museum of
              Art Collection API.
            </p>
            <p className="mt-2 text-gray-300">
              <a
                href="https://metmuseum.github.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:underline"
              >
                API Documentation
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} SupKnowledge. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
