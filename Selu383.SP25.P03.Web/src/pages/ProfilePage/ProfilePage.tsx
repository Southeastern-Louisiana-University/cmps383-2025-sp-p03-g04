// src/pages/ProfilePage/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ReservationDto } from "../../types/Reservation";
import * as reservationService from "../../services/reservationService";
import { getMovie } from "../../services/movieService";
import "./ProfilePage.css";

interface UserBooking extends ReservationDto {
  status?: string;
  posterUrl?: string;
}

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "bookings">("profile");
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: "/profile" } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const userReservations = await reservationService.getUserReservations(
          user.id
        );

        // Get movie data for each reservation to fetch poster URLs
        const bookingsWithDetails = await Promise.all(
          userReservations.map(async (reservation) => {
            try {
              // Fetch the showtime data to get the movie ID
              const response = await fetch(
                `/api/showtimes/${reservation.showtimeId}`
              );
              if (response.ok) {
                const showtimeData = await response.json();
                const movieData = await getMovie(showtimeData.movieId);

                return {
                  ...reservation,
                  posterUrl: movieData.posterUrl,
                  status:
                    new Date(reservation.showtimeStartTime) > new Date()
                      ? "Upcoming"
                      : "Completed",
                };
              }
            } catch (err) {
              console.error("Error fetching movie data:", err);
            }

            // Fallback if unable to fetch movie data
            return {
              ...reservation,
              status:
                new Date(reservation.showtimeStartTime) > new Date()
                  ? "Upcoming"
                  : "Completed",
            };
          })
        );

        // Sort by date (newest first)
        bookingsWithDetails.sort(
          (a, b) =>
            new Date(b.showtimeStartTime).getTime() -
            new Date(a.showtimeStartTime).getTime()
        );

        setBookings(bookingsWithDetails);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "bookings" && user?.id) {
      fetchUserBookings();
    }
  }, [activeTab, user?.id]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <h2>{user?.username}</h2>
            <p className="member-since">
              Member since {new Date().getFullYear()}
            </p>
          </div>

          <nav className="profile-nav">
            <button
              className={`nav-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <i className="fas fa-user"></i>
              Profile
            </button>
            <button
              className={`nav-item ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              <i className="fas fa-ticket-alt"></i>
              My Bookings
            </button>
            <button className="nav-item sign-out" onClick={handleSignOut}>
              <i className="fas fa-sign-out-alt"></i>
              Sign Out
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeTab === "profile" && (
            <div className="profile-section">
              <h1>My Profile</h1>
              <div className="profile-info-card">
                <h3>Account Information</h3>
                <div className="info-row">
                  <label>Username</label>
                  <span>{user?.username}</span>
                </div>
                <div className="info-row">
                  <label>Account Type</label>
                  <span className="account-badge">
                    {user?.role || "Customer"}
                  </span>
                </div>
              </div>

              {user?.role === "manager" && (
                <div className="profile-info-card">
                  <h3>Manager Access</h3>
                  <div className="info-row">
                    <label>Access Level</label>
                    <span>All Theaters</span>
                  </div>
                  <div className="info-row">
                    <label>Reports Access</label>
                    <span>Full Access</span>
                  </div>
                </div>
              )}

              {user?.role === "staff" && (
                <div className="profile-info-card">
                  <h3>Staff Access</h3>
                  <div className="info-row">
                    <label>Department</label>
                    <span>Theater Operations</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="bookings-section">
              <h1>My Bookings</h1>

              {loading ? (
                <div
                  className="loading-message"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Loading your bookings...
                </div>
              ) : error ? (
                <div
                  className="error-message"
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "#ef4444",
                  }}
                >
                  {error}
                </div>
              ) : bookings.length === 0 ? (
                <div
                  className="no-bookings"
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  You don't have any bookings yet.
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-card">
                      <div className="booking-poster">
                        <img
                          src={
                            booking.posterUrl ||
                            "/images/placeholder-poster.jpg"
                          }
                          alt={booking.movieTitle}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/placeholder-poster.jpg";
                          }}
                        />
                      </div>
                      <div className="booking-info">
                        <h3>{booking.movieTitle}</h3>
                        <p>
                          <i className="fas fa-building"></i>{" "}
                          {booking.theaterName}
                        </p>
                        <p>
                          <i className="fas fa-clock"></i>{" "}
                          {formatDate(booking.showtimeStartTime)}
                        </p>
                        <p>
                          <i className="fas fa-tv"></i> {booking.screenName}
                        </p>
                        <p>
                          <i className="fas fa-chair"></i> Seats:{" "}
                          {booking.tickets
                            .map((t) => `${t.row}${t.number}`)
                            .join(", ")}
                        </p>
                        <div className="booking-footer">
                          <span
                            className={`status ${booking.status?.toLowerCase()}`}
                          >
                            {booking.status}
                          </span>
                          <span className="amount">
                            ${booking.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
