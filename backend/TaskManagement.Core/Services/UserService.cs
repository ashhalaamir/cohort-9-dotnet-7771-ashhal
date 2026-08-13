using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async System.Threading.Tasks.Task<User> CreateAsync(User user)
        {
            ArgumentNullException.ThrowIfNull(user);
            return await _userRepository.CreateAsync(user);
        }

        public async System.Threading.Tasks.Task<User?> GetByIdAsync(int id)
        {
            return await _userRepository.GetByIdAsync(id);
        }

        public async System.Threading.Tasks.Task<User?> GetByEmailAsync(string email)
        {
            ArgumentNullException.ThrowIfNull(email);
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email must not be empty.", nameof(email));
            return await _userRepository.GetByEmailAsync(email);
        }

        public async System.Threading.Tasks.Task<IEnumerable<User>> GetAllAsync()
        {
            return await _userRepository.GetAllAsync();
        }

        public async System.Threading.Tasks.Task<User> UpdateAsync(User user)
        {
            ArgumentNullException.ThrowIfNull(user);
            return await _userRepository.UpdateAsync(user);
        }

        public async System.Threading.Tasks.Task DeleteAsync(int id)
        {
            await _userRepository.DeleteAsync(id);
        }
    }
}