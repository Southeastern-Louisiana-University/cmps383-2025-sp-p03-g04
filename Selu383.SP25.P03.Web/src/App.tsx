import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage/MovieDetailsPage";
import BookingPage from "./pages/BookingPage/BookingPage";
import ManagerDashboardPage from "./pages/ManagerDashboardPage/ManagerDashboardPage";
import { CartProvider } from "./contexts/CartContext";

import "./App.css";

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/:id" element={<MovieDetailsPage />} />
            <Route path="/booking/:showtimeId" element={<BookingPage />} />
            <Route path="/managerdashboard" element={<ManagerDashboardPage />} />
            {/* <Route path="/movies" element={<MoviesPage />} /> */}
            {/* <Route path="/concessions" element={<ConcessionsPage />} />
            <Route path="/theaters" element={<TheatersPage />} />  */}
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;