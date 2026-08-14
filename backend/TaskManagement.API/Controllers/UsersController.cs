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
            // 🔥 FIXED: Validate injected dependencies
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
            
            // 🔥 Reject missing identity claims
            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
            {
                _logger.LogWarning("User ID claim is missing or empty.");
                throw new UnauthorizedAccessException("User identity is invalid.");
            }

            // 🔥 Reject invalid identity claims (malformed or non-positive)
            if (!int.TryParse(userIdClaim.Value, out var userId) || userId <= 0)
            {
                _logger.LogWarning("User ID claim has invalid value: {UserIdClaim}", userIdClaim.Value);
                throw new UnauthorizedAccessException("User identity is invalid.");
            }

            return userId;
        }

        // ============================================================
        // GET: api/users/profile
        // 🔥 Generic exception handling removed - Global middleware handles it
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
        // 🔥 Generic exception handling removed - Global middleware handles it
        // ============================================================
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
        {
            // 🔥 Validate request
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
            
            // 🔥 Validate at least one field is being updated
            if (string.IsNullOrEmpty(request.Username) && string.IsNullOrEmpty(request.Email))
            {
                _logger.LogWarning("User {UserId} attempted update with no changes", userId);
                return BadRequest(new { message = "At least one field (username or email) must be provided." });
            }
            
            // Update fields
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
    }
}