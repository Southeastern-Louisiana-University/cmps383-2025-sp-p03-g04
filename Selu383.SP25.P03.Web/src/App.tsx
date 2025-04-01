import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage/MovieDetailsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />

          {/* <Route path="/movies" element={<MoviesPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          <Route path="/concessions" element={<ConcessionsPage />} />
          <Route path="/theaters" element={<TheatersPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
