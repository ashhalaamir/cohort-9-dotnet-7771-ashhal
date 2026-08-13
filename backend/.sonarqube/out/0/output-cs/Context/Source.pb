¥
\C:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Class1.cs?namespace TaskManagement.Core;

public class Class1
{

}
ParseOptions.0.json’
hC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\DTOs\TaskFilterDto.cs”namespace TaskManagement.Core.DTOs
{
    public class TaskFilterDto
    {
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public string? Search { get; set; }
        public DateTime? DueDateFrom { get; set; }
        public DateTime? DueDateTo { get; set; }
        public string? SortBy { get; set; }
        public string? SortOrder { get; set; }
    }
}
ParseOptions.0.json
lC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Helpers\PasswordHasher.csÍusing System.Security.Cryptography;
using System.Text;

namespace TaskManagement.Core.Helpers
{
    public static class PasswordHasher
    {
        private const string Pbkdf2Identifier = "pbkdf2-sha256";
        private const int SaltSize = 16; // 128-bit salt
        private const int KeySize = 32; // 256-bit key
        private const int Iterations = 600_000; // OWASP guidance for PBKDF2-HMAC-SHA-256 recommends a higher work factor; benchmark on target hardware.

        /// <summary>
        /// Hashes a password using PBKDF2 with a per-password salt.
        /// </summary>
        public static string HashPassword(string password)
        {
            ArgumentNullException.ThrowIfNull(password);

            using var deriveBytes = new Rfc2898DeriveBytes(password, SaltSize, Iterations, HashAlgorithmName.SHA256);
            var salt = deriveBytes.Salt;
            var key = deriveBytes.GetBytes(KeySize);

            return string.Join('$', Pbkdf2Identifier, Iterations, Convert.ToBase64String(salt), Convert.ToBase64String(key));
        }

        /// <summary>
        /// Verifies a password against the stored hash, supporting PBKDF2 and legacy SHA256 hashes.
        /// </summary>
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            ArgumentNullException.ThrowIfNull(password);
            ArgumentNullException.ThrowIfNull(hashedPassword);

            if (hashedPassword.StartsWith(Pbkdf2Identifier + '$', StringComparison.Ordinal))
            {
                var parts = hashedPassword.Split('$', 4);
                if (parts.Length != 4)
                    return false;

                if (!int.TryParse(parts[1], out var iterations) || iterations <= 0)
                    return false;

                try
                {
                    var salt = Convert.FromBase64String(parts[2]);
                    var storedKey = Convert.FromBase64String(parts[3]);

                    using var deriveBytes = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
                    var computedKey = deriveBytes.GetBytes(storedKey.Length);

                    return CryptographicOperations.FixedTimeEquals(computedKey, storedKey);
                }
                catch (FormatException)
                {
                    return false;
                }
            }

            // Legacy SHA256 hash support.
            try
            {
                using var sha256 = SHA256.Create();
                var computedHash = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var computedBase64 = Convert.ToBase64String(computedHash);
                return CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(computedBase64),
                    Encoding.UTF8.GetBytes(hashedPassword));
            }
            catch
            {
                return false;
            }
        }
    }
}ParseOptions.0.jsonø
mC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\IAuthService.cs∏using TaskManagement.Core.Models;

namespace TaskManagement.Core.Interfaces
{
    public interface IAuthService
    {
        /// <summary>
        /// Registers a new user
        /// </summary>
        Task<User?> Register(string username, string email, string password);

        /// <summary>
        /// Logs in a user
        /// </summary>
        Task<User?> Login(string email, string password);

        /// <summary>
        /// Generates a JWT token for a user
        /// </summary>
        string GenerateJwtToken(User user);
    }
}ParseOptions.0.jsonâ
rC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\IDashboardService.csParseOptions.0.json≤
pC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\ITaskRepository.cs®using TaskManagement.Core.DTOs;
using TaskManagement.Core.Models;
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
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetFilteredAsync(TaskFilterDto filter, int userId, bool isAdmin);
    }
}
ParseOptions.0.json…

mC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\ITaskService.cs¬	using TaskManagement.Core.DTOs;
using TaskManagement.Core.Models;
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
        System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetFilteredAsync(TaskFilterDto filter, int userId, bool isAdmin);
        
        // Admin-only or explicit assignment operations
        System.Threading.Tasks.Task<TaskEntity?> AssignTaskAsync(int taskId, int assignToUserId, int adminUserId, bool isAdmin);
    }
}ParseOptions.0.jsonß
pC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\IUserRepository.csùusing TaskManagement.Core.Models;

namespace TaskManagement.Core.Interfaces
{
    public interface IUserRepository
    {
        System.Threading.Tasks.Task<User> CreateAsync(User user);
        System.Threading.Tasks.Task<User?> GetByIdAsync(int id);
        System.Threading.Tasks.Task<User?> GetByEmailAsync(string email);
        System.Threading.Tasks.Task<IEnumerable<User>> GetAllAsync();
        System.Threading.Tasks.Task<User> UpdateAsync(User user);
        System.Threading.Tasks.Task DeleteAsync(int id);
    }
}
ParseOptions.0.jsonü
mC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Interfaces\IUserService.csòusing TaskManagement.Core.Models;

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
}ParseOptions.0.jsonæ
hC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Models\JwtSettings.csºusing System.ComponentModel.DataAnnotations;
using System.Text;

namespace TaskManagement.Core.Models
{
    public sealed class JwtSettings
    {
        [Required]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Issuer { get; set; } = string.Empty;

        [Required]
        public string Audience { get; set; } = string.Empty;

        [Range(1, 365)]
        public int ExpiryInDays { get; set; } = 7;

        public void Validate()
        {
            const int minimumKeyLength = 32;

            if (string.IsNullOrWhiteSpace(Key))
                throw new InvalidOperationException("JWT signing key is required and cannot be empty.");

            if (Key.Length < minimumKeyLength)
                throw new InvalidOperationException($"JWT signing key must be at least {minimumKeyLength} characters long.");

            if (Key == "YourSuperSecretKeyForDevelopment123!@#$%^&*()_+")
                throw new InvalidOperationException("A valid JWT signing key must be provided via environment or secret store. The development placeholder is not allowed.");

            var keyBytes = Encoding.UTF8.GetByteCount(Key);
            if (keyBytes < 32)
                throw new InvalidOperationException("JWT signing key must be at least 32 UTF-8 bytes long.");

            if (string.IsNullOrWhiteSpace(Issuer))
                throw new InvalidOperationException("JWT issuer is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(Audience))
                throw new InvalidOperationException("JWT audience is required and cannot be empty.");

            if (ExpiryInDays < 1 || ExpiryInDays > 365)
                throw new InvalidOperationException("JWT expiry must be between 1 and 365 days.");
        }
    }
}
ParseOptions.0.jsoné
aC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Models\Task.csìusing System;
// üî• ADD THIS to avoid ambiguity with System.Threading.Tasks.Task
using SystemTask = System.Threading.Tasks.Task;

namespace TaskManagement.Core.Models
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Status { get; set; } = "Pending";
        public string Priority { get; set; } = "Medium";
        public string Category { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }
    }
}ParseOptions.0.json¥
aC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Models\User.csπusing System;
using System.Collections.Generic;

namespace TaskManagement.Core.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string Role { get; set; } = "RegularUser"; // "Admin" or "RegularUser"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation property - A user can have many tasks
        public ICollection<Task> Tasks { get; set; } = new List<Task>();
    }
}ParseOptions.0.jsonŒ
jC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Services\AuthService.cs using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using TaskManagement.Core.Helpers;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;

        public AuthService(IUserRepository userRepository, JwtSettings jwtSettings)
        {
            ArgumentNullException.ThrowIfNull(userRepository);
            ArgumentNullException.ThrowIfNull(jwtSettings);

            _userRepository = userRepository;
            _jwtSettings = jwtSettings;
        }

        public async Task<User?> Register(string username, string email, string password)
        {
            ArgumentNullException.ThrowIfNull(username);
            ArgumentNullException.ThrowIfNull(email);
            ArgumentNullException.ThrowIfNull(password);
            if (string.IsNullOrWhiteSpace(username))
                throw new ArgumentException("Username must not be empty.", nameof(username));
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email must not be empty.", nameof(email));
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password must not be empty.", nameof(password));

            // Check if user already exists
            var existingUser = await _userRepository.GetByEmailAsync(email);
            if (existingUser != null)
                return null;

            // Hash password and create user with fixed role
            var user = new User
            {
                Username = username,
                Email = email,
                PasswordHash = PasswordHasher.HashPassword(password),
                Role = "RegularUser"
            };

            return await _userRepository.CreateAsync(user);
        }

        public async Task<User?> Login(string email, string password)
        {
            ArgumentNullException.ThrowIfNull(email);
            ArgumentNullException.ThrowIfNull(password);
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email must not be empty.", nameof(email));
            if (string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("Password must not be empty.", nameof(password));

            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
                return null;

            // Verify password
            if (!PasswordHasher.VerifyPassword(password, user.PasswordHash))
                return null;

            return user;
        }

        public string GenerateJwtToken(User user)
        {
            ArgumentNullException.ThrowIfNull(user);

            _jwtSettings.Validate();

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(_jwtSettings.ExpiryInDays),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}ParseOptions.0.jsonÜ
oC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Services\DashboardService.csParseOptions.0.jsonœ,
jC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Services\TaskService.csÀ+using System.Linq;
using TaskManagement.Core.DTOs;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskEntity = TaskManagement.Core.Models.Task;

namespace TaskManagement.Core.Services
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository;

        public TaskService(ITaskRepository taskRepository, IUserRepository userRepository)
        {
            ArgumentNullException.ThrowIfNull(taskRepository);
            ArgumentNullException.ThrowIfNull(userRepository);

            _taskRepository = taskRepository;
            _userRepository = userRepository;
        }

        // ============================================================
        // Authorization-aware task service methods
        // ============================================================

        public async System.Threading.Tasks.Task<TaskEntity> CreateAsync(TaskEntity task, int userId)
        {
            ArgumentNullException.ThrowIfNull(task);
            ValidateTask(task);
            task.UserId = userId;
            return await _taskRepository.CreateAsync(task);
        }

        public async System.Threading.Tasks.Task<TaskEntity?> GetByIdAsync(int id, int userId, bool isAdmin)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null) return null;
            
            // Check access: Admin can see all, regular users only their own
            if (!isAdmin && task.UserId != userId)
                return null;
                
            return task;
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetAllAsync(int userId, bool isAdmin)
        {
            if (isAdmin)
                return await _taskRepository.GetAllAsync();
            else
                return await _taskRepository.GetByUserIdAsync(userId);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetByUserIdAsync(int targetUserId, int requesterUserId, bool isAdmin)
        {
            if (!isAdmin && targetUserId != requesterUserId)
                return Enumerable.Empty<TaskEntity>();

            return await _taskRepository.GetByUserIdAsync(targetUserId);
        }

        public async System.Threading.Tasks.Task<TaskEntity?> UpdateAsync(int id, TaskEntity updatedTask, int userId, bool isAdmin)
        {
            ArgumentNullException.ThrowIfNull(updatedTask);

            var existingTask = await _taskRepository.GetByIdAsync(id);
            if (existingTask == null) return null;
            
            // Check access: Admin can update any, regular users only their own
            if (!isAdmin && existingTask.UserId != userId)
                return null;

            ValidateTask(updatedTask);
            
            // Update fields
            existingTask.Title = updatedTask.Title;
            existingTask.Description = updatedTask.Description;
            existingTask.Status = updatedTask.Status;
            existingTask.Priority = updatedTask.Priority;
            existingTask.Category = updatedTask.Category;
            existingTask.DueDate = updatedTask.DueDate;
            existingTask.UpdatedAt = DateTime.UtcNow;
            
            return await _taskRepository.UpdateAsync(existingTask);
        }

        public async System.Threading.Tasks.Task<bool> DeleteAsync(int id, int userId, bool isAdmin)
        {
            var task = await _taskRepository.GetByIdAsync(id);
            if (task == null) return false;
            
            // Check access: Admin can delete any, regular users only their own
            if (!isAdmin && task.UserId != userId)
                return false;
            
            await _taskRepository.DeleteAsync(id);
            return true;
        }

        public async System.Threading.Tasks.Task<TaskEntity?> AssignTaskAsync(int taskId, int assignToUserId, int adminUserId, bool isAdmin)
        {
            if (!isAdmin)
                return null;

            var task = await _taskRepository.GetByIdAsync(taskId);
            if (task == null)
                return null;

            var assignToUser = await _userRepository.GetByIdAsync(assignToUserId);
            if (assignToUser == null)
                return null;

            task.UserId = assignToUserId;
            task.UpdatedAt = DateTime.UtcNow;

            return await _taskRepository.UpdateAsync(task);
        }

        public async System.Threading.Tasks.Task<IEnumerable<TaskEntity>> GetFilteredAsync(TaskFilterDto filter, int userId, bool isAdmin)
        {
            ArgumentNullException.ThrowIfNull(filter);
            return await _taskRepository.GetFilteredAsync(filter, userId, isAdmin);
        }

        private static void ValidateTask(TaskEntity task)
        {
            if (string.IsNullOrWhiteSpace(task.Title))
                throw new System.ComponentModel.DataAnnotations.ValidationException("Title is required.");

            if (task.Description?.Length > 1000)
                throw new System.ComponentModel.DataAnnotations.ValidationException("Description cannot exceed 1000 characters.");

            if (task.DueDate.Date < DateTime.UtcNow.Date)
                throw new System.ComponentModel.DataAnnotations.ValidationException("Due date cannot be in the past.");
        }
    }
}ParseOptions.0.jsonµ
jC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\Services\UserService.cs±using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;

namespace TaskManagement.Core.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            ArgumentNullException.ThrowIfNull(userRepository);
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
}ParseOptions.0.jsonÀ
âC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\obj\Debug\net8.0\TaskManagement.Core.GlobalUsings.g.csß// <auto-generated/>
global using global::System;
global using global::System.Collections.Generic;
global using global::System.IO;
global using global::System.Linq;
global using global::System.Net.Http;
global using global::System.Threading;
global using global::System.Threading.Tasks;
ParseOptions.0.jsonÛ
íC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\obj\Debug\net8.0\.NETCoreApp,Version=v8.0.AssemblyAttributes.cs∆// <autogenerated />
using System;
using System.Reflection;
[assembly: global::System.Runtime.Versioning.TargetFrameworkAttribute(".NETCoreApp,Version=v8.0", FrameworkDisplayName = ".NET 8.0")]
ParseOptions.0.json©	
áC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Core\obj\Debug\net8.0\TaskManagement.Core.AssemblyInfo.csá//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Reflection;

[assembly: System.Reflection.AssemblyCompanyAttribute("TaskManagement.Core")]
[assembly: System.Reflection.AssemblyConfigurationAttribute("Debug")]
[assembly: System.Reflection.AssemblyFileVersionAttribute("1.0.0.0")]
[assembly: System.Reflection.AssemblyInformationalVersionAttribute("1.0.0+0372add0d6ad8491e67f292ff4e627ecd3379b3e")]
[assembly: System.Reflection.AssemblyProductAttribute("TaskManagement.Core")]
[assembly: System.Reflection.AssemblyTitleAttribute("TaskManagement.Core")]
[assembly: System.Reflection.AssemblyVersionAttribute("1.0.0.0")]

// Generated by the MSBuild WriteCodeFragment class.

ParseOptions.0.json