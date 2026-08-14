using System.Linq;
using TaskManagement.Core.DTOs;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskEntity = TaskManagement.Core.Models.Task;

namespace TaskManagement.Core.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository;

        public TaskService(ITaskRepository taskRepository, IUserRepository userRepository)
        {
            ArgumentNullException.ThrowIfNull(taskRepository);
            ArgumentNullException.ThrowIfNull(userRepository);

            _taskRepository = taskRepository;
            _userRepository = userRepository;
        }

        // ============================================================
        // Authorization-aware task service methods
        // ============================================================

        public async System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task, int userId)
        {
            ArgumentNullException.ThrowIfNull(task);
            ValidateTask(task);
            task.UserId = userId;
            return await _taskRepository.CreateAsync(task);
        }

        public async System.Threading.Tasks.Task<TaskEntity?> GetByIdAsync(int id, int userId, bool isAdmin)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null) return null;
            
            // Check access: Admin can see all, regular users only their own
            if (!isAdmin && task.UserId != userId)
                return null;
                
            return task;
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetAllAsync(int userId, bool isAdmin)
        {
            if (isAdmin)
                return await _taskRepository.GetAllAsync();
            else
                return await _taskRepository.GetByUserIdAsync(userId);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetByUserIdAsync(int targetUserId, int requesterUserId, bool isAdmin)
        {
            if (!isAdmin && targetUserId != requesterUserId)
                return Enumerable.Empty<TaskEntity>();

            return await _taskRepository.GetByUserIdAsync(targetUserId);
        }

        public async System.Threading.Tasks.Task<TaskEntity?> UpdateAsync(int id, TaskEntity updatedTask, int userId, bool isAdmin)
        {
            ArgumentNullException.ThrowIfNull(updatedTask);

            var existingTask = await _taskRepository.GetByIdAsync(id);
            if (existingTask == null) return null;
            
            // Check access: Admin can update any, regular users only their own
            if (!isAdmin && existingTask.UserId != userId)
                return null;

            ValidateTask(updatedTask);
            
            // Update fields
            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.Status = updatedTask.Status;
            existingTask.Priority = updatedTask.Priority;
            existingTask.Category = updatedTask.Category;
            existingTask.DueDate = updatedTask.DueDate;
            existingTask.UpdatedAt = DateTime.UtcNow;
            
            return await _taskRepository.UpdateAsync(existingTask);
        }

        public async System.Threading.Tasks.Task<bool> DeleteAsync(int id, int userId, bool isAdmin)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null) return false;
            
            // Check access: Admin can delete any, regular users only their own
            if (!isAdmin && task.UserId != userId)
                return false;
            
            await _taskRepository.DeleteAsync(id);
            return true;
        }

        public async System.Threading.Tasks.Task<TaskEntity?> AssignTaskAsync(int taskId, int assignToUserId, int adminUserId, bool isAdmin)
        {
            if (!isAdmin)
                return null;

            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
                return null;

            var assignToUser = await _userRepository.GetByIdAsync(assignToUserId);
            if (assignToUser == null)
                return null;

            task.UserId = assignToUserId;
            task.UpdatedAt = DateTime.UtcNow;

            return await _taskRepository.UpdateAsync(task);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetFilteredAsync(TaskFilterDto filter, int userId, bool isAdmin)
        {
            ArgumentNullException.ThrowIfNull(filter);
            return await _taskRepository.GetFilteredAsync(filter, userId, isAdmin);
        }

        private static void ValidateTask(TaskEntity task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
                throw new System.ComponentModel.DataAnnotations.ValidationException("Title is required.");

            if (task.Description?.Length > 1000)
                throw new System.ComponentModel.DataAnnotations.ValidationException("Description cannot exceed 1000 characters.");

            if (task.DueDate.Date < DateTime.UtcNow.Date)
                throw new System.ComponentModel.DataAnnotations.ValidationException("Due date cannot be in the past.");
        }
    }
}