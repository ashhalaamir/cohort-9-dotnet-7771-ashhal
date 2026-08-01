using TaskManagement.Core.Interfaces;
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
        // Original methods (keep for backward compatibility)
        // ============================================================

        public async System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task)
        {
            ArgumentNullException.ThrowIfNull(task);
            ValidateTask(task);
            return await _taskRepository.CreateAsync(task);
        }

        public async System.Threading.Tasks.Task<TaskEntity?> GetByIdAsync(int id)
        {
            return await _taskRepository.GetByIdAsync(id);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetAllAsync()
        {
            return await _taskRepository.GetAllAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetByUserIdAsync(int userId)
        {
            return await _taskRepository.GetByUserIdAsync(userId);
        }

        public async System.Threading.Tasks.Task<TaskEntity> UpdateAsync(TaskEntity task)
        {
            ArgumentNullException.ThrowIfNull(task);
            ValidateTask(task);
            return await _taskRepository.UpdateAsync(task);
        }

        public async System.Threading.Tasks.Task DeleteAsync(int id)
        {
            await _taskRepository.DeleteAsync(id);
        }

        // ============================================================
        // 🔥 NEW: Extended methods with authorization
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

        public async System.Threading.Tasks.Task<TaskEntity?> UpdateAsync(int id, TaskEntity updatedTask, int userId, bool isAdmin)
        {
            ArgumentNullException.ThrowIfNull(updatedTask);
            ValidateTask(updatedTask);

            var existingTask = await _taskRepository.GetByIdAsync(id);
            if (existingTask == null) return null;
            
            // Check access: Admin can update any, regular users only their own
            if (!isAdmin && existingTask.UserId != userId)
                return null;
            
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