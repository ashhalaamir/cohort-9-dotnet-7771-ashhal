using Microsoft.AspNetCore.Mvc;
using TaskManagement.API.DTOs;
using TaskManagement.Core.Interfaces;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new user
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto request)
        {
            try
            {
                _logger.LogInformation($"Attempting to register user: {request.Email}");

                var user = await _authService.Register(
                    request.Username,
                    request.Email,
                    request.Password,
                    request.Role ?? "RegularUser"
                );

                if (user == null)
                {
                    _logger.LogWarning($"Registration failed: User already exists with email {request.Email}");
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
                    TokenExpiry = DateTime.UtcNow.AddDays(7)
                };

                _logger.LogInformation($"User registered successfully: {user.Email}");
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error registering user: {request.Email}");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        /// <summary>
        /// Login a user
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            try
            {
                _logger.LogInformation($"Attempting login for user: {request.Email}");

                var user = await _authService.Login(request.Email, request.Password);

                if (user == null)
                {
                    _logger.LogWarning($"Login failed for user: {request.Email} - Invalid credentials");
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
                    TokenExpiry = DateTime.UtcNow.AddDays(7)
                };

                _logger.LogInformation($"User logged in successfully: {user.Email}");
                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error logging in user: {request.Email}");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }
    }
}