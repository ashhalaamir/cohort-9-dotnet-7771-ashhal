using TaskEntity = TaskManagement.Core.Models.Task;

namespace TaskManagement.Core.Interfaces
{
    public interface ITaskRepository
    {
        System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task);
        System.Threading.Tasks.Task<TaskEntity?> GetByIdAsync(int id);
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetAllAsync();
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetByUserIdAsync(int userId);
        System.Threading.Tasks.Task<TaskEntity> UpdateAsync(TaskEntity task);
        System.Threading.Tasks.Task DeleteAsync(int id);
    }
}
