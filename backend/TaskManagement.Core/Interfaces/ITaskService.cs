using TaskEntity = TaskManagement.Core.Models.Task;

namespace TaskManagement.Core.Interfaces
{
    public interface ITaskService
    {
        // Basic CRUD
        System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task);
        System.Threading.Tasks.Task<TaskEntity?> GetByIdAsync(int id);
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetAllAsync();
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetByUserIdAsync(int userId);
        System.Threading.Tasks.Task<TaskEntity> UpdateAsync(TaskEntity task);
        System.Threading.Tasks.Task DeleteAsync(int id);
        
        // 🔥 NEW: Extended methods with authorization
        System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task, int userId);
        System.Threading.Tasks.Task<TaskEntity?> GetByIdAsync(int id, int userId, bool isAdmin);
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetAllAsync(int userId, bool isAdmin);
        System.Threading.Tasks.Task<TaskEntity?> UpdateAsync(int id, TaskEntity task, int userId, bool isAdmin);
        System.Threading.Tasks.Task<bool> DeleteAsync(int id, int userId, bool isAdmin);
        
        // 🔥 NEW: Admin only - assign task to another user
        System.Threading.Tasks.Task<TaskEntity?> AssignTaskAsync(int taskId, int assignToUserId, int adminUserId);
    }
}