using TaskManagement.Core.Models;

namespace TaskManagement.Core.Interfaces
{
    public interface IAuthService
    {
        /// <summary>
        /// Registers a new user
        /// </summary>
        Task<User?> Register(string username, string email, string password, string role = "RegularUser");

        /// <summary>
        /// Logs in a user
        /// </summary>
        Task<User?> Login(string email, string password);

        /// <summary>
        /// Generates a JWT token for a user
        /// </summary>
        string GenerateJwtToken(User user);
    }
}