using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagement.API.DTOs;
using TaskManagement.Core.Interfaces;

namespace TaskManagement.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            ArgumentNullException.ThrowIfNull(userService);
            ArgumentNullException.ThrowIfNull(logger);

            _userService = userService;
            _logger = logger;
        }

        // ============================================================
        // 🔥 FIXED: Proper user validation with null checks
        // Reject missing or invalid user ID claims
        // ============================================================
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            
            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
            {
                _logger.LogWarning("User ID claim is missing or empty.");
                throw new UnauthorizedAccessException("User identity is invalid.");
            }

            if (!int.TryParse(userIdClaim.Value, out var userId) || userId <= 0)
            {
                _logger.LogWarning("User ID claim has invalid value: {UserIdClaim}", userIdClaim.Value);
                throw new UnauthorizedAccessException("User identity is invalid.");
            }

            return userId;
        }

        // ============================================================
        // GET: api/users/profile
        // ============================================================
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = GetCurrentUserId();
            _logger.LogInformation("User {UserId} fetching profile", userId);
            
            var user = await _userService.GetByIdAsync(userId);
            
            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found", userId);
                return NotFound(new { message = "User not found" });
            }
            
            return Ok(new UserProfileDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        // ============================================================
        // PUT: api/users/profile
        // ============================================================
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
        {
            if (request == null)
            {
                _logger.LogWarning("Update profile request body is null");
                return BadRequest(new { message = "Request body is required." });
            }

            var userId = GetCurrentUserId();
            _logger.LogInformation("User {UserId} updating profile", userId);
            
            var user = await _userService.GetByIdAsync(userId);
            
            if (user == null)
            {
                _logger.LogWarning("User {UserId} not found", userId);
                return NotFound(new { message = "User not found" });
            }
            
            if (string.IsNullOrEmpty(request.Username) && string.IsNullOrEmpty(request.Email))
            {
                _logger.LogWarning("User {UserId} attempted update with no changes", userId);
                return BadRequest(new { message = "At least one field (username or email) must be provided." });
            }
            
            if (!string.IsNullOrWhiteSpace(request.Username))
                user.Username = request.Username;
            
            if (!string.IsNullOrWhiteSpace(request.Email))
                user.Email = request.Email;
            
            user.UpdatedAt = DateTime.UtcNow;
            
            var updated = await _userService.UpdateAsync(user);
            
            _logger.LogInformation("User {UserId} profile updated successfully", userId);
            
            return Ok(new UserProfileDto
            {
                Id = updated.Id,
                Username = updated.Username,
                Email = updated.Email,
                Role = updated.Role,
                CreatedAt = updated.CreatedAt
            });
        }

        // ============================================================
        // 🔥 NEW: GET: api/users/all
        // Admin only - Get all users in the system
        // ============================================================
        [Authorize(Roles = "Admin")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            _logger.LogInformation("Admin fetching all users");
            
            var users = await _userService.GetAllAsync();
            
            var response = users.Select(u => new UserProfileDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt
            });
            
            return Ok(response);
        }
    }
}