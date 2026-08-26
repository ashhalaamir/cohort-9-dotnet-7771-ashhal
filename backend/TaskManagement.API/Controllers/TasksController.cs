using System.Security.Claims;
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

            return Ok(ToDtoWithUser(task));
        }

        // ============================================================
        // POST: api/tasks
        // Regular User: Creates task assigned to themselves
        // Admin: Can create task and assign to ANY user
        // ============================================================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskDto request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (userId, isAdmin) = GetCurrentUser();
            _logger.LogInformation("Creating new task for userId {UserId} (IsAdmin: {IsAdmin}).", userId, isAdmin);
            
            try
            {
                // Determine which user the task should be assigned to
                int targetUserId;
                
                if (isAdmin && request.AssignToUserId.HasValue)
                {
                    // Admin can assign to any user
                    targetUserId = request.AssignToUserId.Value;
                    _logger.LogInformation("Admin assigning task to user {TargetUserId}.", targetUserId);
                    
                    // Verify the target user exists
                    var targetUser = await _userRepository.GetByIdAsync(targetUserId);
                    if (targetUser == null)
                    {
                        return BadRequest(new { message = "Target user not found." });
                    }
                }
                else
                {
                    // Regular user (or admin without AssignToUserId) assigns to themselves
                    targetUserId = userId;
                }

                var created = await _taskService.CreateAsync(ToEntity(request), targetUserId);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, ToDtoWithUser(created));
            }
            catch (System.ComponentModel.DataAnnotations.ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error creating task for userId {UserId}.", userId);
                return BadRequest(new { message = ex.Message });
            }
        }

        // ============================================================
        // PUT: api/tasks/{id}
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

                return Ok(ToDtoWithUser(updated));
            }
            catch (System.ComponentModel.DataAnnotations.ValidationException ex)
            {
                _logger.LogWarning(ex, "Validation error updating task {TaskId} for userId {UserId}.", id, GetUserId());
                return BadRequest(new { message = ex.Message });
            }
        }

        // ============================================================
        // DELETE: api/tasks/{id}
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
        // 🔥 ADMIN ONLY - Assign task to another user
        // ============================================================
        [HttpPost("{id}/assign")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Assign(int id, [FromBody] TaskDto request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (adminUserId, _) = GetCurrentUser();
            _logger.LogInformation("Assigning task {TaskId} to userId {AssignToUserId} by adminUserId {AdminUserId}.", 
                id, request.UserId, adminUserId);

            // Check if the target user exists
            var assignToUser = await _userRepository.GetByIdAsync(request.UserId);
            if (assignToUser == null)
            {
                _logger.LogWarning("Assign failed: target userId {AssignToUserId} does not exist.", request.UserId);
                return BadRequest(new { message = "Target user does not exist." });
            }

            // Get the task
            var task = await _taskService.GetByIdAsync(id, adminUserId, true);
            if (task == null)
            {
                _logger.LogWarning("Task {TaskId} not found or invalid state for adminUserId {AdminUserId}.", id, adminUserId);
                return NotFound();
            }

            // 🔥 FIXED: Create updated task entity with new UserId
            var updatedTask = new TaskEntity
            {
                Title = task.Title,
                Description = task.Description,
                Status = task.Status,
                Priority = task.Priority,
                Category = task.Category,
                DueDate = task.DueDate,
                UserId = request.UserId
            };

            // Update the task
            var updated = await _taskService.UpdateAsync(id, updatedTask, adminUserId, true);

            return Ok(ToDtoWithUser(updated));
        }

        // ============================================================
        // Private Helper Methods
        // ============================================================

        private static TaskDto ToDtoWithUser(TaskEntity task) => new()
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            Status = task.Status,
            Priority = task.Priority,
            Category = task.Category,
            DueDate = task.DueDate,
            UserId = task.UserId,
            UserName = task.User?.Username ?? "Unknown",
            CreatedAt = task.CreatedAt,
            UpdatedAt = task.UpdatedAt
        };

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
            Description = dto.Description ?? string.Empty,
            Status = dto.Status,
            Priority = dto.Priority,
            Category = dto.Category,
            DueDate = dto.DueDate
        };

        private static TaskEntity ToEntity(UpdateTaskDto dto) => new()
        {
            Title = dto.Title,
            Description = dto.Description ?? string.Empty,
            Status = dto.Status,
            Priority = dto.Priority,
            Category = dto.Category,
            DueDate = dto.DueDate
        };
    }
}