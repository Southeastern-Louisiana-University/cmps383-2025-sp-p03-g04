import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import MovieDetailsPage from "./pages/MovieDetailsPage/MovieDetailsPage";
import ManagerDashboardPage from "./pages/ManagerDashboardPage/ManagerDashboardPage";
import ConcessionsPage from "./pages/ConcessionsPage/ConcessionsPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
          <Route path="/managerdashboard" element={<ManagerDashboardPage />} />
          {/* <Route path="/movies" element={<MoviesPage />} /> */}
           <Route path="/concessions" element={<ConcessionsPage />} />
          {/* <Route path="/theaters" element={<TheatersPage />} />  */} 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
