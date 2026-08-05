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

        private (int userId, bool isAdmin) GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            
            var userId = int.Parse(userIdClaim?.Value ?? "0");
            var isAdmin = roleClaim?.Value == "Admin";
            
            return (userId, isAdmin);
        }

        // ============================================================
        // GET: api/dashboard/stats
        // Regular User: Gets stats for their own tasks
        // Admin: Gets stats for ALL tasks in the system
        // ============================================================
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            try
            {
                var (userId, isAdmin) = GetCurrentUser();
                _logger.LogInformation($"User {userId} (IsAdmin: {isAdmin}) fetching dashboard stats");
                
                // Get tasks based on user role
                var tasks = await _taskService.GetAllAsync(userId, isAdmin);
                
                var stats = new DashboardStatsDto
                {
                    TotalTasks = tasks.Count(),
                    Completed = tasks.Count(t => t.Status == "Completed"),
                    InProgress = tasks.Count(t => t.Status == "InProgress"),
                    Pending = tasks.Count(t => t.Status == "Pending")
                };
                
                _logger.LogInformation($"User {userId} stats: Total={stats.TotalTasks}, " +
                    $"Completed={stats.Completed}, InProgress={stats.InProgress}, Pending={stats.Pending}");
                
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting dashboard stats for user");
                return StatusCode(500, new { message = "An error occurred while retrieving dashboard statistics" });
            }
        }

        // ============================================================
        // GET: api/dashboard/stats/admin
        // 🔥 ADMIN ONLY - Gets stats for ALL tasks (same as regular stats for admin)
        // This is a separate endpoint for explicit admin access
        // ============================================================
        [Authorize(Roles = "Admin")]
        [HttpGet("stats/admin")]
        public async Task<IActionResult> GetAdminStats()
        {
            try
            {
                var (adminUserId, _) = GetCurrentUser();
                _logger.LogInformation($"Admin {adminUserId} fetching full system stats");
                
                // Get ALL tasks (admin view)
                var allTasks = await _taskService.GetAllAsync(0, true);
                
                var stats = new DashboardStatsDto
                {
                    TotalTasks = allTasks.Count(),
                    Completed = allTasks.Count(t => t.Status == "Completed"),
                    InProgress = allTasks.Count(t => t.Status == "InProgress"),
                    Pending = allTasks.Count(t => t.Status == "Pending")
                };
                
                _logger.LogInformation($"Admin {adminUserId} system stats: Total={stats.TotalTasks}, " +
                    $"Completed={stats.Completed}, InProgress={stats.InProgress}, Pending={stats.Pending}");
                
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting admin dashboard stats");
                return StatusCode(500, new { message = "An error occurred while retrieving admin statistics" });
            }
        }

        // ============================================================
        // GET: api/dashboard/stats/user/{userId}
        // 🔥 ADMIN ONLY - Get stats for a specific user
        // ============================================================
        [Authorize(Roles = "Admin")]
        [HttpGet("stats/user/{userId}")]
        public async Task<IActionResult> GetUserStats(int userId)
        {
            try
            {
                var (adminUserId, _) = GetCurrentUser();
                _logger.LogInformation($"Admin {adminUserId} fetching stats for user {userId}");
                
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
                
                _logger.LogInformation($"User {userId} stats: Total={stats.TotalTasks}, " +
                    $"Completed={stats.Completed}, InProgress={stats.InProgress}, Pending={stats.Pending}");
                
                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting stats for user {userId}");
                return StatusCode(500, new { message = "An error occurred while retrieving user statistics" });
            }
        }
    }
}