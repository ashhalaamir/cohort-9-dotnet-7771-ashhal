using TaskManagement.Core.Interfaces;
using TaskEntity = TaskManagement.Core.Models.Task;

namespace TaskManagement.Core.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;

        public TaskService(ITaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        // ============================================================
        // Original methods (keep for backward compatibility)
        // ============================================================

        public async System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task)
        {
            ArgumentNullException.ThrowIfNull(task);
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

        public async System.Threading.Tasks.Task<TaskEntity?> AssignTaskAsync(int taskId, int assignToUserId, int adminUserId)
        {
            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null) return null;
            
            // Only admin can assign tasks to others (checked in controller)
            task.UserId = assignToUserId;
            task.UpdatedAt = DateTime.UtcNow;
            
            return await _taskRepository.UpdateAsync(task);
        }
    }
}