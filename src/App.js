import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import AdvancedSearchPage from "./pages/AdvancedSearchPage"
import ItemDetailPage from "./pages/ItemDetailPage"
import SearchResultsPage from "./pages/SearchResultsPage"
import { SearchProvider } from "./context/SearchContext"
import "./App.css"

function App() {
  return (
    <Router>
      <SearchProvider>
        <div className="flex flex-col min-h-screen bg-neutral-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/advanced-search" element={<AdvancedSearchPage />} />
              <Route path="/object/:objectId" element={<ItemDetailPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </SearchProvider>
    </Router>
  )
}

export default App
