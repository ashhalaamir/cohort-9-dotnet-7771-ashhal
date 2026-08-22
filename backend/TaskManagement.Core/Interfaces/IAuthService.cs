using TaskManagement.Core.Models;

namespace TaskManagement.Core.Interfaces
{
    public interface IAuthService
    {
        /// <summary>
        /// Registers a new user
        /// </summary>
        /// <param name="username">The username</param>
        /// <param name="email">The email address</param>
        /// <param name="password">The password</param>
        /// <param name="role">The role (Admin or RegularUser). Defaults to RegularUser.</param>
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