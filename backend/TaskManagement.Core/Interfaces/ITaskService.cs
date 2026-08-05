using TaskEntity = TaskManagement.Core.Models.Task;

namespace TaskManagement.Core.Interfaces
{
    public interface ITaskService
    {
        // Authorization-aware task operations
        System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task, int userId);
        System.Threading.Tasks.Task<TaskEntity?> GetByIdAsync(int id, int userId, bool isAdmin);
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetAllAsync(int userId, bool isAdmin);
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetByUserIdAsync(int targetUserId, int requesterUserId, bool isAdmin);
        System.Threading.Tasks.Task<TaskEntity?> UpdateAsync(int id, TaskEntity task, int userId, bool isAdmin);
        System.Threading.Tasks.Task<bool> DeleteAsync(int id, int userId, bool isAdmin);
        
        // Admin-only or explicit assignment operations
        System.Threading.Tasks.Task<TaskEntity?> AssignTaskAsync(int taskId, int assignToUserId, int adminUserId, bool isAdmin);
    }
}