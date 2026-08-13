≥
oC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\Controllers\AuthController.cs™using Microsoft.AspNetCore.Mvc;
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
            ArgumentNullException.ThrowIfNull(authService);
            ArgumentNullException.ThrowIfNull(logger);
            ArgumentNullException.ThrowIfNull(jwtSettings);

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
    }
}ParseOptions.0.jsonú7
tC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\Controllers\DashboardController.csé6using Microsoft.AspNetCore.Authorization;
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
        // üî• FIXED: Proper user validation with null checks
        // ============================================================
        private (int userId, bool isAdmin) GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            var roleClaim = User.FindFirst(ClaimTypes.Role);
            
            // üî• Reject missing or invalid identity claims
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
        // üî• REMOVED: local catch block - ExceptionMiddleware handles it
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
        // üî• ADMIN ONLY - Gets stats for ALL tasks
        // üî• REMOVED: local catch block - ExceptionMiddleware handles it
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
        // üî• ADMIN ONLY - Get stats for a specific user
        // üî• REMOVED: local catch block - ExceptionMiddleware handles it
        // ============================================================
        [Authorize(Roles = "Admin")]
        [HttpGet("stats/user/{userId}")]
        public async Task<IActionResult> GetUserStats(int userId)
        {
            // üî• Validate userId parameter
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
}ParseOptions.0.json–Y
pC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\Controllers\TasksController.cs∆Xusing System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskManagement.API.DTOs;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskEntity = TaskManagement.Core.Models.Task;
using ApiTaskFilterDto = TaskManagement.API.DTOs.TaskFilterDto;
using CoreTaskFilterDto = TaskManagement.Core.DTOs.TaskFilterDto;

namespace TaskManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly IUserRepository _userRepository;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskService taskService, IUserRepository userRepository, ILogger<TasksController> logger)
        {
            ArgumentNullException.ThrowIfNull(taskService);
            ArgumentNullException.ThrowIfNull(userRepository);
            ArgumentNullException.ThrowIfNull(logger);

            _taskService = taskService;
            _userRepository = userRepository;
            _logger = logger;
        }

        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : 0;
        }

        private bool IsAdmin() => User.IsInRole("Admin");

        private (int userId, bool isAdmin) GetCurrentUser()
        {
            return (GetUserId(), IsAdmin());
        }

        // ============================================================
        // GET: api/tasks
        // Regular User: Gets their own tasks with filters
        // Admin: Gets ALL tasks with filters
        // üî• Generic exception handling removed - Global middleware handles it
        // ============================================================
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] ApiTaskFilterDto filter)
        {
            filter ??= new ApiTaskFilterDto();
            var (userId, isAdmin) = GetCurrentUser();
            _logger.LogInformation("User {UserId} (IsAdmin: {IsAdmin}) fetching tasks with filters.", userId, isAdmin);

            var coreFilter = new CoreTaskFilterDto
            {
                Status = filter.Status,
                Priority = filter.Priority,
                Category = filter.Category,
                Search = filter.Search,
                DueDateFrom = filter.DueDateFrom,
                DueDateTo = filter.DueDateTo,
                SortBy = filter.SortBy,
                SortOrder = filter.SortOrder
            };

            var tasks = await _taskService.GetFilteredAsync(coreFilter, userId, isAdmin);

            var response = tasks.Select(t => new TaskResponseDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                Status = t.Status,
                Priority = t.Priority,
                Category = t.Category,
                DueDate = t.DueDate,
                CreatedAt = t.CreatedAt,
                UpdatedAt = t.UpdatedAt,
                UserId = t.UserId,
                UserName = t.User?.Username ?? "Unknown"
            });

            _logger.LogInformation("User {UserId} fetched {TaskCount} tasks.", userId, response.Count());
            return Ok(response);
        }

        // ============================================================
        // GET: api/tasks/{id}
        // Regular User: Can only access if they own the task
        // Admin: Can access ANY task
        // üî• Generic exception handling removed - Global middleware handles it
        // ============================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            _logger.LogInformation("Fetching task {TaskId} for userId {UserId}.", id, GetUserId());
            var task = await _taskService.GetByIdAsync(id, GetUserId(), IsAdmin());
            
            if (task == null)
            {
                _logger.LogWarning("Task {TaskId} not found or access denied for userId {UserId}.", id, GetUserId());
                return NotFound();
            }

            return Ok(ToDto(task));
        }

        // ============================================================
        // POST: api/tasks
        // Regular User: Creates task assigned to themselves
        // Admin: Can create task and assign to ANY user
        // üî• Generic exception handling removed - Global middleware handles it
        // ============================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation("Creating new task for userId {UserId}.", GetUserId());
            
            try
            {
                var created = await _taskService.CreateAsync(ToEntity(request), GetUserId());
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToDto(created));
            }
            catch (System.ComponentModel.DataAnnotations.ValidationException ex)
            {
                // üî• Keep this - specific validation exception needs 400 response
                _logger.LogWarning(ex, "Validation error creating task for userId {UserId}.", GetUserId());
                return BadRequest(new { message = ex.Message });
            }
            // üî• All other exceptions bubble up to global middleware
        }

        // ============================================================
        // PUT: api/tasks/{id}
        // Regular User: Can only update their own tasks
        // Admin: Can update ANY task
        // üî• Generic exception handling removed - Global middleware handles it
        // ============================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation("Updating task {TaskId} for userId {UserId}.", id, GetUserId());
            
            try
            {
                var updated = await _taskService.UpdateAsync(id, ToEntity(request), GetUserId(), IsAdmin());
                
                if (updated == null)
                {
                    _logger.LogWarning("Task {TaskId} not found or access denied for update by userId {UserId}.", id, GetUserId());
                    return NotFound();
                }

                return Ok(ToDto(updated));
            }
            catch (System.ComponentModel.DataAnnotations.ValidationException ex)
            {
                // üî• Keep this - specific validation exception needs 400 response
                _logger.LogWarning(ex, "Validation error updating task {TaskId} for userId {UserId}.", id, GetUserId());
                return BadRequest(new { message = ex.Message });
            }
            // üî• All other exceptions bubble up to global middleware
        }

        // ============================================================
        // DELETE: api/tasks/{id}
        // Regular User: Can only delete their own tasks
        // Admin: Can delete ANY task
        // üî• Generic exception handling removed - Global middleware handles it
        // ============================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            _logger.LogInformation("Deleting task {TaskId} for userId {UserId}.", id, GetUserId());
            
            var deleted = await _taskService.DeleteAsync(id, GetUserId(), IsAdmin());
            
            if (!deleted)
            {
                _logger.LogWarning("Task {TaskId} not found or access denied for delete by userId {UserId}.", id, GetUserId());
                return NotFound();
            }

            return NoContent();
        }

        // ============================================================
        // POST: api/tasks/{id}/assign
        // üî• ADMIN ONLY - Assign task to another user
        // üî• Generic exception handling removed - Global middleware handles it
        // ============================================================
        [HttpPost("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Assign(int id, [FromBody] TaskDto request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _logger.LogInformation("Assigning task {TaskId} to userId {AssignToUserId} by adminUserId {AdminUserId}.", 
                id, request.UserId, GetUserId());

            var assignToUser = await _userRepository.GetByIdAsync(request.UserId);
            if (assignToUser == null)
            {
                _logger.LogWarning("Assign failed: target userId {AssignToUserId} does not exist.", request.UserId);
                return BadRequest(new { message = "Target user does not exist." });
            }

            var assigned = await _taskService.AssignTaskAsync(id, request.UserId, GetUserId(), IsAdmin());
            
            if (assigned == null)
            {
                _logger.LogWarning("Task {TaskId} not found or invalid state for adminUserId {AdminUserId}.", id, GetUserId());
                return NotFound();
            }

            return Ok(ToDto(assigned));
        }

        // ============================================================
        // Private Helper Methods
        // ============================================================

        private static TaskDto ToDto(TaskEntity task) => new()
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            Category = task.Category,
            DueDate = task.DueDate,
            UserId = task.UserId,
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };

        private static TaskEntity ToEntity(CreateTaskDto dto) => new()
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            Category = dto.Category,
            DueDate = dto.DueDate
        };

        private static TaskEntity ToEntity(UpdateTaskDto dto) => new()
        {
            Title = dto.Title,
            Description = dto.Description,
            Status = dto.Status,
            Priority = dto.Priority,
            Category = dto.Category,
            DueDate = dto.DueDate
        };
    }
}ParseOptions.0.jsonò+
pC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\Controllers\UsersController.csé*using Microsoft.AspNetCore.Authorization;
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
            // üî• FIXED: Validate injected dependencies
            ArgumentNullException.ThrowIfNull(userService);
            ArgumentNullException.ThrowIfNull(logger);

            _userService = userService;
            _logger = logger;
        }

        // ============================================================
        // üî• FIXED: Proper user validation with null checks
        // Reject missing or invalid user ID claims
        // ============================================================
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            
            // üî• Reject missing identity claims
            if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
            {
                _logger.LogWarning("User ID claim is missing or empty.");
                throw new UnauthorizedAccessException("User identity is invalid.");
            }

            // üî• Reject invalid identity claims (malformed or non-positive)
            if (!int.TryParse(userIdClaim.Value, out var userId) || userId <= 0)
            {
                _logger.LogWarning("User ID claim has invalid value: {UserIdClaim}", userIdClaim.Value);
                throw new UnauthorizedAccessException("User identity is invalid.");
            }

            return userId;
        }

        // ============================================================
        // GET: api/users/profile
        // üî• Generic exception handling removed - Global middleware handles it
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
        // üî• Generic exception handling removed - Global middleware handles it
        // ============================================================
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto request)
        {
            // üî• Validate request
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
            
            // üî• Validate at least one field is being updated
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
}ParseOptions.0.json†
iC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\AuthResponseDto.csùnamespace TaskManagement.API.DTOs
{
    public class AuthResponseDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public DateTime TokenExpiry { get; set; }
    }
}ParseOptions.0.jsonÊ
gC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\CreateTaskDto.csÂusing System.ComponentModel.DataAnnotations;
using TaskManagement.API.Validation;

namespace TaskManagement.API.DTOs
{
    public class CreateTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        [RegularExpression("^(Pending|InProgress|Completed)$", ErrorMessage = "Status must be Pending, InProgress, or Completed.")]
        public string Status { get; set; } = "Pending";

        [Required]
        [RegularExpression("^(Medium|High|Low)$", ErrorMessage = "Priority must be Medium, High, or Low.")]
        public string Priority { get; set; } = "Medium";

        public string Category { get; set; } = string.Empty;

        [NotInPast]
        public DateTime DueDate { get; set; }
    }
}
ParseOptions.0.jsoné
kC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\DashboardStatsDto.csânamespace TaskManagement.API.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalTasks { get; set; }
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Pending { get; set; }
    }
}ParseOptions.0.json∑
bC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\LoginDto.csªusing System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}ParseOptions.0.jsonË
eC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\RegisterDto.csÈusing System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MinLength(8, ErrorMessage = "Password must be at least 8 characters long.")]
        public string Password { get; set; } = string.Empty;
    }
}ParseOptions.0.json 
aC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\TaskDto.csœnamespace TaskManagement.API.DTOs
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "Pending";
        public string Priority { get; set; } = "Medium";
        public string Category { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
ParseOptions.0.jsonî
gC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\TaskFilterDto.csìnamespace TaskManagement.API.DTOs
{
    public class TaskFilterDto
    {
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public string? Search { get; set; }
        public DateTime? DueDateFrom { get; set; }
        public DateTime? DueDateTo { get; set; }
        public string? SortBy { get; set; } // "dueDate", "priority", "status", "createdAt"
        public string? SortOrder { get; set; } // "asc" or "desc"
    }
}ParseOptions.0.jsonü
iC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\TaskResponseDto.csúnamespace TaskManagement.API.DTOs
{
    public class TaskResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
ParseOptions.0.json©
jC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\UpdateProfileDto.cs•using System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.DTOs
{
    public class UpdateProfileDto
    {
        [MinLength(3, ErrorMessage = "Username must be at least 3 characters long.")]
        [MaxLength(50, ErrorMessage = "Username cannot exceed 50 characters.")]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain letters, numbers, and underscores.")]
        public string? Username { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters.")]
        public string? Email { get; set; }
    }
}ParseOptions.0.jsonÊ
gC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\UpdateTaskDto.csÂusing System.ComponentModel.DataAnnotations;
using TaskManagement.API.Validation;

namespace TaskManagement.API.DTOs
{
    public class UpdateTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [Required]
        [RegularExpression("^(Pending|InProgress|Completed)$", ErrorMessage = "Status must be Pending, InProgress, or Completed.")]
        public string Status { get; set; } = "Pending";

        [Required]
        [RegularExpression("^(Medium|High|Low)$", ErrorMessage = "Priority must be Medium, High, or Low.")]
        public string Priority { get; set; } = "Medium";

        public string Category { get; set; } = string.Empty;

        [NotInPast]
        public DateTime DueDate { get; set; }
    }
}
ParseOptions.0.json·
hC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\DTOs\UserProfileDto.csﬂnamespace TaskManagement.API.DTOs
{
    public class UserProfileDto
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }
}ParseOptions.0.jsonŒ$
sC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\Middleware\ExceptionMiddleware.cs¡#using System.Net;
using System.Text.Json;

namespace TaskManagement.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger,
            IWebHostEnvironment env)
        {
            // üî• FIXED: Validate all injected dependencies
            ArgumentNullException.ThrowIfNull(next);
            ArgumentNullException.ThrowIfNull(logger);
            ArgumentNullException.ThrowIfNull(env);

            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            // üî• FIXED: Use fixed public messages in production
            var (statusCode, message) = MapException(exception);

            var response = new ErrorResponse
            {
                StatusCode = statusCode,
                Message = _env.IsDevelopment() 
                    ? message  // ‚úÖ Development: Show full exception message
                    : GetPublicMessage(statusCode), // ‚úÖ Production: Use fixed messages
                Timestamp = DateTime.UtcNow
            };

            context.Response.StatusCode = response.StatusCode;

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response, jsonOptions);
            await context.Response.WriteAsync(json);
        }

        // ============================================================
        // üî• NEW: Separate mapping logic for status codes and messages
        // ============================================================
        private (int statusCode, string message) MapException(Exception exception)
        {
            return exception switch
            {
                ArgumentNullException => ((int)HttpStatusCode.BadRequest, exception.Message),
                ArgumentException => ((int)HttpStatusCode.BadRequest, exception.Message),
                UnauthorizedAccessException => ((int)HttpStatusCode.Unauthorized, "You are not authorized to perform this action."),
                KeyNotFoundException => ((int)HttpStatusCode.NotFound, exception.Message),
                InvalidOperationException => ((int)HttpStatusCode.BadRequest, exception.Message),
                System.ComponentModel.DataAnnotations.ValidationException => ((int)HttpStatusCode.BadRequest, exception.Message),
                _ => ((int)HttpStatusCode.InternalServerError, "An error occurred while processing your request.")
            };
        }

        // ============================================================
        // üî• NEW: Fixed public messages for production
        // ============================================================
        private static string GetPublicMessage(int statusCode)
        {
            return statusCode switch
            {
                400 => "The request could not be processed due to invalid input.",
                401 => "You are not authorized to perform this action.",
                403 => "You do not have permission to access this resource.",
                404 => "The requested resource could not be found.",
                409 => "The request conflicts with the current state of the resource.",
                422 => "The request could not be processed due to validation errors.",
                _ => "An error occurred while processing your request."
            };
        }
    }

    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? Details { get; set; }
    }
}ParseOptions.0.json¡)
\C:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\Program.csÀ(using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Events;
using System.Text;
using TaskManagement.API.Middleware;
using TaskManagement.Infrastructure.Data;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Services;
using InfrastructureRepositories = TaskManagement.Infrastructure.Repositories;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "TaskManagementAPI")
    .WriteTo.Console()
    .WriteTo.File(
        path: "logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 7,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Use Serilog as the logger
builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAuthorization();

// üî• Register JWT Authentication
var jwtSettings = new TaskManagement.Core.Models.JwtSettings();
builder.Configuration.GetSection("Jwt").Bind(jwtSettings);
jwtSettings.Validate();

var jwtKeyBytes = Encoding.UTF8.GetBytes(jwtSettings.Key);
var jwtSecurityKey = new SymmetricSecurityKey(jwtKeyBytes);

builder.Services.AddSingleton(jwtSettings);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = jwtSecurityKey
        };
    });

// üî• Register Database Context
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("A production database connection string named 'DefaultConnection' must be provided. In development, place the LocalDB string in appsettings.Development.json.");
}

if (!builder.Environment.IsDevelopment())
{
    var builderOptions = new SqlConnectionStringBuilder(connectionString);

    if (!string.IsNullOrWhiteSpace(builderOptions.DataSource) &&
        (builderOptions.DataSource.Contains("LocalDB", StringComparison.OrdinalIgnoreCase) ||
         builderOptions.DataSource.Contains("(localdb)", StringComparison.OrdinalIgnoreCase)))
    {
        throw new InvalidOperationException("LocalDB is not supported in production. Provide a production-ready SQL Server connection string via secure configuration.");
    }

    if (builderOptions.TrustServerCertificate)
    {
        throw new InvalidOperationException("TrustServerCertificate=True is not allowed in production. Use a properly validated SQL Server certificate.");
    }

    if (builderOptions.IntegratedSecurity)
    {
        throw new InvalidOperationException("Trusted connection / Windows authentication is not portable for production. Supply a production-ready SQL Server connection string.");
    }

    if (!builderOptions.Encrypt)
    {
        throw new InvalidOperationException("Encrypt=False is not allowed in production. Use an encrypted SQL Server connection string.");
    }
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// üî• Register Dependency Injection (DI) for Services and Repositories
builder.Services.AddScoped<IUserRepository, InfrastructureRepositories.UserRepository>();
builder.Services.AddScoped<ITaskRepository, InfrastructureRepositories.TaskRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserService, UserService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// In local development without HTTPS configured, skip automatic HTTPS redirection.
// This prevents the warning about missing HTTPS port when running with `dotnet run`.
if (app.Urls.Any(url => url.StartsWith("https://", StringComparison.OrdinalIgnoreCase)))
{
    app.UseHttpsRedirection();
}

app.UseSerilogRequestLogging();
app.UseMiddleware<ExceptionMiddleware>();

// üî• IMPORTANT: Authentication must come before Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Ok(new { message = "TaskManagement.API is running" }));

app.Run();ParseOptions.0.jsonπ
rC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\Validation\NotInPastAttribute.cs≠using System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.Validation
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public sealed class NotInPastAttribute : ValidationAttribute
    {
        public NotInPastAttribute()
            : base("The date cannot be in the past.")
        {
        }

        public override bool IsValid(object? value)
        {
            if (value == null)
                return true;

            if (value is DateTime date)
                return date.Date >= DateTime.UtcNow.Date;

            return false;
        }
    }
}
ParseOptions.0.json§
áC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\obj\Debug\net8.0\TaskManagement.API.GlobalUsings.g.csÇ// <auto-generated/>
global using global::Microsoft.AspNetCore.Builder;
global using global::Microsoft.AspNetCore.Hosting;
global using global::Microsoft.AspNetCore.Http;
global using global::Microsoft.AspNetCore.Routing;
global using global::Microsoft.Extensions.Configuration;
global using global::Microsoft.Extensions.DependencyInjection;
global using global::Microsoft.Extensions.Hosting;
global using global::Microsoft.Extensions.Logging;
global using global::System;
global using global::System.Collections.Generic;
global using global::System.IO;
global using global::System.Linq;
global using global::System.Net.Http;
global using global::System.Net.Http.Json;
global using global::System.Threading;
global using global::System.Threading.Tasks;
ParseOptions.0.jsonÚ
ëC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\obj\Debug\net8.0\.NETCoreApp,Version=v8.0.AssemblyAttributes.cs∆// <autogenerated />
using System;
using System.Reflection;
[assembly: global::System.Runtime.Versioning.TargetFrameworkAttribute(".NETCoreApp,Version=v8.0", FrameworkDisplayName = ".NET 8.0")]
ParseOptions.0.json≤

ÖC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\obj\Debug\net8.0\TaskManagement.API.AssemblyInfo.csí	//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Reflection;

[assembly: Microsoft.Extensions.Configuration.UserSecrets.UserSecretsIdAttribute("TaskManagement.API-0cf6d58c-145f-4e95-8a2a-3cd47db1e8a6")]
[assembly: System.Reflection.AssemblyCompanyAttribute("TaskManagement.API")]
[assembly: System.Reflection.AssemblyConfigurationAttribute("Debug")]
[assembly: System.Reflection.AssemblyFileVersionAttribute("1.0.0.0")]
[assembly: System.Reflection.AssemblyInformationalVersionAttribute("1.0.0+0372add0d6ad8491e67f292ff4e627ecd3379b3e")]
[assembly: System.Reflection.AssemblyProductAttribute("TaskManagement.API")]
[assembly: System.Reflection.AssemblyTitleAttribute("TaskManagement.API")]
[assembly: System.Reflection.AssemblyVersionAttribute("1.0.0.0")]

// Generated by the MSBuild WriteCodeFragment class.

ParseOptions.0.jsonÏ
òC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.API\obj\Debug\net8.0\TaskManagement.API.MvcApplicationPartsAssemblyInfo.csπ//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Reflection;

[assembly: Microsoft.AspNetCore.Mvc.ApplicationParts.ApplicationPartAttribute("Microsoft.AspNetCore.OpenApi")]
[assembly: Microsoft.AspNetCore.Mvc.ApplicationParts.ApplicationPartAttribute("Swashbuckle.AspNetCore.SwaggerGen")]

// Generated by the MSBuild WriteCodeFragment class.

ParseOptions.0.json