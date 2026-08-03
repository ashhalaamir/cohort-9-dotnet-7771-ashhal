using Microsoft.AspNetCore.Mvc;
using TaskManagement.API.DTOs;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;
        private readonly JwtSettings _jwtSettings;

        public AuthController(IAuthService authService, ILogger<AuthController> logger, JwtSettings jwtSettings)
        {
            _authService = authService;
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

            try
            {
                _logger.LogInformation("Attempting user registration.");

                var user = await _authService.Register(
                    request.Username,
                    request.Email,
                    request.Password
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

                _logger.LogInformation("User registered successfully with userId {UserId}.", user.Id);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error during registration.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user.");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        /// <summary>
        /// Login a user
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
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

                _logger.LogInformation("User logged in successfully with userId {UserId}.", user.Id);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error during login.");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging in user.");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }
    }
}