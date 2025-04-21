using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Selu383.SP25.P03.Api.Data;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Services
{
    public class GuestSessionService
    {
        private readonly IDistributedCache _cache;
        private readonly DataContext _dataContext;
        private readonly TimeSpan _sessionExpiry = TimeSpan.FromHours(24);

        public GuestSessionService(IDistributedCache cache, DataContext dataContext)
        {
            _cache = cache;
            _dataContext = dataContext;
        }

        public async Task<string> CreateGuestSession()
        {
            var sessionId = Guid.NewGuid().ToString();
            var sessionData = new GuestSessionData
            {
                SessionId = sessionId,
                CreatedAt = DateTime.UtcNow
            };

            await SaveSessionData(sessionId, sessionData);
            return sessionId;
        }

        public async Task<GuestSessionData?> GetSessionData(string sessionId)
        {
            var data = await _cache.GetStringAsync($"guest_session:{sessionId}");
            if (string.IsNullOrEmpty(data))
                return null;

            return JsonSerializer.Deserialize<GuestSessionData>(data);
        }

        public async Task AddReservationToSession(string sessionId, int reservationId)
        {
            var sessionData = await GetSessionData(sessionId);
            if (sessionData == null)
                throw new ArgumentException("Guest session not found");

            sessionData.ReservationIds.Add(reservationId);
            await SaveSessionData(sessionId, sessionData);
        }

        public async Task AddFoodOrderToSession(string sessionId, int orderId)
        {
            var sessionData = await GetSessionData(sessionId);
            if (sessionData == null)
                throw new ArgumentException("Guest session not found");

            sessionData.FoodOrderIds.Add(orderId);
            await SaveSessionData(sessionId, sessionData);
        }

        public async Task MigrateSessionToUser(string sessionId, int userId)
        {
            var sessionData = await GetSessionData(sessionId);
            if (sessionData == null)
                throw new ArgumentException("Guest session not found");

            // Update all reservations to the user
            foreach (var reservationId in sessionData.ReservationIds)
            {
                var reservation = await _dataContext.Reservations.FindAsync(reservationId);
                if (reservation != null)
                {
                    reservation.UserId = userId;
                }
            }

            // Update all food orders to the user
            foreach (var orderId in sessionData.FoodOrderIds)
            {
                var order = await _dataContext.FoodOrders.FindAsync(orderId);
                if (order != null)
                {
                    order.UserId = userId;
                }
            }

            await _dataContext.SaveChangesAsync();

            // Delete the session
            await _cache.RemoveAsync($"guest_session:{sessionId}");
        }

        private async Task SaveSessionData(string sessionId, GuestSessionData data)
        {
            var jsonData = JsonSerializer.Serialize(data);
            await _cache.SetStringAsync(
                $"guest_session:{sessionId}",
                jsonData,
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = _sessionExpiry
                });
        }
    }

    public class GuestSessionData
    {
        public required string SessionId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<int> ReservationIds { get; set; } = new List<int>();
        public List<int> FoodOrderIds { get; set; } = new List<int>();
    }
}