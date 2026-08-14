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
        // Regular User: Gets their own tasks with filters
        // Admin: Gets ALL tasks with filters
        // 🔥 Generic exception handling removed - Global middleware handles it
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
        // 🔥 Generic exception handling removed - Global middleware handles it
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
        // 🔥 Generic exception handling removed - Global middleware handles it
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
                // 🔥 Keep this - specific validation exception needs 400 response
                _logger.LogWarning(ex, "Validation error creating task for userId {UserId}.", GetUserId());
                return BadRequest(new { message = ex.Message });
            }
            // 🔥 All other exceptions bubble up to global middleware
        }

        // ============================================================
        // PUT: api/tasks/{id}
        // Regular User: Can only update their own tasks
        // Admin: Can update ANY task
        // 🔥 Generic exception handling removed - Global middleware handles it
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
                // 🔥 Keep this - specific validation exception needs 400 response
                _logger.LogWarning(ex, "Validation error updating task {TaskId} for userId {UserId}.", id, GetUserId());
                return BadRequest(new { message = ex.Message });
            }
            // 🔥 All other exceptions bubble up to global middleware
        }

        // ============================================================
        // DELETE: api/tasks/{id}
        // Regular User: Can only delete their own tasks
        // Admin: Can delete ANY task
        // 🔥 Generic exception handling removed - Global middleware handles it
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
        // 🔥 Generic exception handling removed - Global middleware handles it
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
}