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

        public async System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task)
        {
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
            return await _taskRepository.UpdateAsync(task);
        }

        public async System.Threading.Tasks.Task DeleteAsync(int id)
        {
            await _taskRepository.DeleteAsync(id);
        }
    }
}