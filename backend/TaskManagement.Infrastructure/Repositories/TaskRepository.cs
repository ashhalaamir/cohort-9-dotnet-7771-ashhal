using System.Linq;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Core.DTOs;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
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
            ArgumentNullException.ThrowIfNull(task);
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
            ArgumentNullException.ThrowIfNull(task);
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

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetFilteredAsync(
            TaskFilterDto filter,
            int userId,
            bool isAdmin)
        {
            ArgumentNullException.ThrowIfNull(filter);

            var query = _context.Tasks
                .Include(t => t.User)
                .AsQueryable();

            if (!isAdmin)
            {
                query = query.Where(t => t.UserId == userId);
            }

            if (!string.IsNullOrEmpty(filter.Status))
            {
                query = query.Where(t => t.Status == filter.Status);
            }

            if (!string.IsNullOrEmpty(filter.Priority))
            {
                query = query.Where(t => t.Priority == filter.Priority);
            }

            if (!string.IsNullOrEmpty(filter.Category))
            {
                query = query.Where(t => t.Category == filter.Category);
            }

            if (!string.IsNullOrEmpty(filter.Search))
            {
                var searchTerm = filter.Search.ToLower();
                query = query.Where(t =>
                    t.Title.ToLower().Contains(searchTerm) ||
                    (t.Description != null && t.Description.ToLower().Contains(searchTerm)));
            }

            if (filter.DueDateFrom.HasValue)
            {
                query = query.Where(t => t.DueDate >= filter.DueDateFrom.Value);
            }

            if (filter.DueDateTo.HasValue)
            {
                query = query.Where(t => t.DueDate <= filter.DueDateTo.Value);
            }

            if (!string.IsNullOrEmpty(filter.SortBy))
            {
                query = filter.SortBy.ToLower() switch
                {
                    "duedate" => filter.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(t => t.DueDate)
                        : query.OrderBy(t => t.DueDate),
                    "priority" => filter.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(t => t.Priority)
                        : query.OrderBy(t => t.Priority),
                    "status" => filter.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(t => t.Status)
                        : query.OrderBy(t => t.Status),
                    "createdat" => filter.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(t => t.CreatedAt)
                        : query.OrderBy(t => t.CreatedAt),
                    _ => filter.SortOrder?.ToLower() == "desc"
                        ? query.OrderByDescending(t => t.Title)
                        : query.OrderBy(t => t.Title)
                };
            }
            else
            {
                query = query.OrderBy(t => t.DueDate);
            }

            return await query.ToListAsync();
        }
    }
}