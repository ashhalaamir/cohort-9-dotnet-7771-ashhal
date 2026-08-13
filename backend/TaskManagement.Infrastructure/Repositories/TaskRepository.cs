using Microsoft.EntityFrameworkCore;
using TaskManagement.Core.Interfaces;
using TaskEntity = TaskManagement.Core.Models.Task;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Infrastructure.Repositories
{
    public class TaskRepository : ITaskRepository
    {
        private readonly ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            ArgumentNullException.ThrowIfNull(context);
            _context = context;
        }

        public async System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task)
        {
            _context.Tasks.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async System.Threading.Tasks.Task<TaskEntity?> GetByIdAsync(int id)
        {
            return await _context.Tasks
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetAllAsync()
        {
            return await _context.Tasks
                .Include(t => t.User)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetByUserIdAsync(int userId)
        {
            return await _context.Tasks
                .Include(t => t.User)
                .Where(t => t.UserId == userId)
                .ToListAsync();
        }

        public async System.Threading.Tasks.Task<TaskEntity> UpdateAsync(TaskEntity task)
        {
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async System.Threading.Tasks.Task DeleteAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
        }
    }
}