using TaskManagement.Core.Models;

namespace TaskManagement.Core.Interfaces
{
    public interface IUserService
    {
        System.Threading.Tasks.Task<User> CreateAsync(User user);
        System.Threading.Tasks.Task<User?> GetByIdAsync(int id);
        System.Threading.Tasks.Task<User?> GetByEmailAsync(string email);
        System.Threading.Tasks.Task<IEnumerable<User>> GetAllAsync();
        System.Threading.Tasks.Task<User> UpdateAsync(User user);
        System.Threading.Tasks.Task DeleteAsync(int id);
    }
}