// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage/MovieDetailsPage";
import ConcessionsPage from "./pages/ConcessionsPage/ConcessionsPage";
import MoviesPage from "./pages/MoviesPage/MoviesPage";
import BookingPage from "./pages/BookingPage/BookingPage";
import PaymentPage from "./pages/PaymentPage/PaymentPage";
import ConfirmationPage from "./pages/ConfirmationPage/ConfirmationPage";
import SignInPage from "./pages/SignInPage/SignInPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { CartProvider } from "./contexts/CartContext";
import { TheaterProvider } from "./contexts/TheaterContext";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
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
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/confirmation" element={<ConfirmationPage />} />
                <Route path="/concessions" element={<ConcessionsPage />} />
                <Route path="/concessions/:id" element={<ConcessionsPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route
                  path="*"
                  element={<div className="not-found">Page not found</div>}
                />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </TheaterProvider>
    </AuthProvider>
  );
}

export default App;
