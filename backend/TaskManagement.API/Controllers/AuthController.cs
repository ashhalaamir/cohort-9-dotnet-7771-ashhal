using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TaskManagement.API.DTOs;
using TaskManagement.Core.Helpers;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;
        private readonly ILogger<AuthController> _logger;
        private readonly JwtSettings _jwtSettings;

        public AuthController(IAuthService authService, IUserService userService, ILogger<AuthController> logger, JwtSettings jwtSettings)
        {
            ArgumentNullException.ThrowIfNull(authService);
            ArgumentNullException.ThrowIfNull(userService);
            ArgumentNullException.ThrowIfNull(logger);
            ArgumentNullException.ThrowIfNull(jwtSettings);

            _authService = authService;
            _userService = userService;
            _logger = logger;
            _jwtSettings = jwtSettings;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation("Attempting user registration.");

            var user = await _authService.Register(
                request.Username,
                request.Email,
                request.Password,
                request.Role ?? "RegularUser"
            );

            if (user == null)
            {
                _logger.LogWarning("Registration failed: user already exists.");
                return BadRequest(new { message = "User with this email already exists" });
            }

            var token = _authService.GenerateJwtToken(user);

            var response = new AuthResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                Token = token,
                TokenExpiry = DateTime.UtcNow.AddDays(_jwtSettings.ExpiryInDays)
            };

            _logger.LogInformation("User registered successfully.");
            return Ok(response);
        }

        /// <summary>
        /// Login a user
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation("Attempting user login.");

            var user = await _authService.Login(request.Email, request.Password);

            if (user == null)
            {
                _logger.LogWarning("Login failed: invalid credentials.");
                return Unauthorized(new { message = "Invalid email or password" });
            }

            var token = _authService.GenerateJwtToken(user);

            var response = new AuthResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                Token = token,
                TokenExpiry = DateTime.UtcNow.AddDays(_jwtSettings.ExpiryInDays)
            };

            _logger.LogInformation("User logged in successfully.");
            return Ok(response);
        }

        /// <summary>
        /// Change user password
        /// </summary>
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
                return Unauthorized(new { message = "Invalid user identity." });

            _logger.LogInformation("User {UserId} attempting password change.", userId);

            var user = await _userService.GetByIdAsync(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            // Verify current password
            if (!PasswordHasher.VerifyPassword(request.CurrentPassword, user.PasswordHash))
            {
                _logger.LogWarning("User {UserId} failed password change: incorrect current password.", userId);
                return BadRequest(new { message = "Current password is incorrect." });
            }

            // Hash and update new password
            user.PasswordHash = PasswordHasher.HashPassword(request.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;
            
            await _userService.UpdateAsync(user);

            _logger.LogInformation("User {UserId} changed password successfully.", userId);
            return Ok(new { message = "Password updated successfully." });
        }
    }
}