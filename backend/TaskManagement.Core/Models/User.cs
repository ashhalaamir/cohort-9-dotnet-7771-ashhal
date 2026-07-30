using System;
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
        public ICollection<Task>? Tasks { get; set; }
    }
}