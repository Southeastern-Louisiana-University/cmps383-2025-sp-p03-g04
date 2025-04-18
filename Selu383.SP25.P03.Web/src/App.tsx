import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage/MovieDetailsPage";
import ConcessionsPage from "./pages/ConcessionsPage/ConcessionsPage";
import MoviesPage from "./pages/MoviesPage/MoviesPage";
import BookingPage from "./pages/BookingPage/BookingPage";
import { CartProvider } from "./contexts/CartContext";
import { TheaterProvider } from "./contexts/TheaterContext";
import "./App.css";

function App() {
  return (

    <TheaterProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movies/:id" element={<MovieDetailsPage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
              <Route path="/concessions" element={<ConcessionsPage />} />
              <Route path="*" element={<div className="not-found">Page not found</div>} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </TheaterProvider>

  );
}

export default App;