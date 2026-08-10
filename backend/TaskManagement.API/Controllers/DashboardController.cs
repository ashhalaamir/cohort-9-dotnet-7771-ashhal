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
    public class DashboardController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(ITaskService taskService, ILogger<DashboardController> logger)
        {
            ArgumentNullException.ThrowIfNull(taskService);
            ArgumentNullException.ThrowIfNull(logger);

            _taskService = taskService;
            _logger = logger;
        }

        // ============================================================
        // 🔥 FIXED: Proper user validation with null checks
        // ============================================================
        private (int userId, bool isAdmin) GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            
            // 🔥 Reject missing or invalid identity claims
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

            var isAdmin = roleClaim?.Value == "Admin";
            
            return (userId, isAdmin);
        }

        // ============================================================
        // GET: api/dashboard/stats
        // Regular User: Gets stats for their own tasks
        // Admin: Gets stats for ALL tasks in the system
        // 🔥 REMOVED: local catch block - ExceptionMiddleware handles it
        // ============================================================
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var (userId, isAdmin) = GetCurrentUser();
            _logger.LogInformation("User {UserId} (IsAdmin: {IsAdmin}) fetching dashboard stats", userId, isAdmin);
            
            // Get tasks based on user role
            var tasks = await _taskService.GetAllAsync(userId, isAdmin);
            
            var stats = new DashboardStatsDto
            {
                TotalTasks = tasks.Count(),
                Completed = tasks.Count(t => t.Status == "Completed"),
                InProgress = tasks.Count(t => t.Status == "InProgress"),
                Pending = tasks.Count(t => t.Status == "Pending")
            };
            
            _logger.LogInformation("User {UserId} stats: Total={Total}, Completed={Completed}, InProgress={InProgress}, Pending={Pending}", 
                userId, stats.TotalTasks, stats.Completed, stats.InProgress, stats.Pending);
            
            return Ok(stats);
        }

        // ============================================================
        // GET: api/dashboard/stats/admin
        // 🔥 ADMIN ONLY - Gets stats for ALL tasks
        // 🔥 REMOVED: local catch block - ExceptionMiddleware handles it
        // ============================================================
        [Authorize(Roles = "Admin")]
        [HttpGet("stats/admin")]
        public async Task<IActionResult> GetAdminStats()
        {
            var (adminUserId, _) = GetCurrentUser();
            _logger.LogInformation("Admin {AdminUserId} fetching full system stats", adminUserId);
            
            // Get ALL tasks (admin view)
            var allTasks = await _taskService.GetAllAsync(0, true);
            
            var stats = new DashboardStatsDto
            {
                TotalTasks = allTasks.Count(),
                Completed = allTasks.Count(t => t.Status == "Completed"),
                InProgress = allTasks.Count(t => t.Status == "InProgress"),
                Pending = allTasks.Count(t => t.Status == "Pending")
            };
            
            _logger.LogInformation("Admin {AdminUserId} system stats: Total={Total}, Completed={Completed}, InProgress={InProgress}, Pending={Pending}", 
                adminUserId, stats.TotalTasks, stats.Completed, stats.InProgress, stats.Pending);
            
            return Ok(stats);
        }

        // ============================================================
        // GET: api/dashboard/stats/user/{userId}
        // 🔥 ADMIN ONLY - Get stats for a specific user
        // 🔥 REMOVED: local catch block - ExceptionMiddleware handles it
        // ============================================================
        [Authorize(Roles = "Admin")]
        [HttpGet("stats/user/{userId}")]
        public async Task<IActionResult> GetUserStats(int userId)
        {
            // 🔥 Validate userId parameter
            if (userId <= 0)
            {
                _logger.LogWarning("Invalid userId parameter: {UserId}", userId);
                return BadRequest(new { message = "Invalid user ID." });
            }

            var (adminUserId, _) = GetCurrentUser();
            _logger.LogInformation("Admin {AdminUserId} fetching stats for user {TargetUserId}", adminUserId, userId);
            
            // Get tasks for specific user
            var userTasks = await _taskService.GetByUserIdAsync(userId, adminUserId, true);
            
            if (!userTasks.Any())
            {
                return Ok(new DashboardStatsDto
                {
                    TotalTasks = 0,
                    Completed = 0,
                    InProgress = 0,
                    Pending = 0
                });
            }
            
            var stats = new DashboardStatsDto
            {
                TotalTasks = userTasks.Count(),
                Completed = userTasks.Count(t => t.Status == "Completed"),
                InProgress = userTasks.Count(t => t.Status == "InProgress"),
                Pending = userTasks.Count(t => t.Status == "Pending")
            };
            
            _logger.LogInformation("User {TargetUserId} stats: Total={Total}, Completed={Completed}, InProgress={InProgress}, Pending={Pending}", 
                userId, stats.TotalTasks, stats.Completed, stats.InProgress, stats.Pending);
            
            return Ok(stats);
        }
    }
}