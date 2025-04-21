using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Selu383.SP25.P03.Api.Data;
using Selu383.SP25.P03.Api.Features.Users;
using Selu383.SP25.P03.Api.Services;
using System.Threading.Tasks;

namespace Selu383.SP25.P03.Api.Controllers
{
    [Route("api/guest-sessions")]
    [ApiController]
    public class GuestSessionsController : ControllerBase
    {
        private readonly GuestSessionService _guestSessionService;
        private readonly UserManager<User> _userManager;
        private readonly DataContext _dataContext;

        public GuestSessionsController(
            GuestSessionService guestSessionService,
            UserManager<User> userManager,
            DataContext dataContext)
        {
            _guestSessionService = guestSessionService;
            _userManager = userManager;
            _dataContext = dataContext;
        }

        [HttpPost]
        public async Task<ActionResult<string>> CreateGuestSession()
        {
            var sessionId = await _guestSessionService.CreateGuestSession();
            return Ok(new { SessionId = sessionId });
        }

        [HttpGet("{sessionId}")]
        public async Task<ActionResult<GuestSessionData>> GetSessionData(string sessionId)
        {
            var data = await _guestSessionService.GetSessionData(sessionId);
            if (data == null)
                return NotFound("Guest session not found");

            return data;
        }

        [HttpPost("{sessionId}/reservations/{reservationId}")]
        public async Task<ActionResult> AddReservationToSession(string sessionId, int reservationId)
        {
            try
            {
                await _guestSessionService.AddReservationToSession(sessionId, reservationId);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost("{sessionId}/food-orders/{orderId}")]
        public async Task<ActionResult> AddFoodOrderToSession(string sessionId, int orderId)
        {
            try
            {
                await _guestSessionService.AddFoodOrderToSession(sessionId, orderId);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }

        public class MigrateSessionRequest
        {
            public required string Username { get; set; }
            public required string Password { get; set; }
        }

        [HttpPost("{sessionId}/migrate")]
        public async Task<ActionResult> MigrateSessionToUser(string sessionId, MigrateSessionRequest request)
        {
            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!result)
                return Unauthorized("Invalid password");

            try
            {
                await _guestSessionService.MigrateSessionToUser(sessionId, user.Id);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}