using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using TaskManagement.Core.Models;
using TaskManagement.Infrastructure.Data;

namespace TaskManagement.Tests
{
    public abstract class TestBase : IDisposable
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbContextOptions<ApplicationDbContext> _options;

        protected TestBase()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            _context = new ApplicationDbContext(_options);
            SeedDatabase();
        }

        private void SeedDatabase()
        {
            // Seed test users
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Username = "testuser",
                    Email = "test@example.com",
                    PasswordHash = "hashedpassword",
                    Role = "RegularUser",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Username = "adminuser",
                    Email = "admin@example.com",
                    PasswordHash = "hashedadmin",
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.Users.AddRange(users);

            // Seed test tasks - using TaskEntity alias to avoid ambiguity
            var tasks = new List<TaskManagement.Core.Models.Task>
            {
                new TaskManagement.Core.Models.Task
                {
                    Id = 1,
                    Title = "Test Task 1",
                    Description = "Description 1",
                    Status = "Pending",
                    Priority = "High",
                    Category = "Work",
                    DueDate = DateTime.UtcNow.AddDays(7),
                    UserId = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new TaskManagement.Core.Models.Task
                {
                    Id = 2,
                    Title = "Test Task 2",
                    Description = "Description 2",
                    Status = "Completed",
                    Priority = "Medium",
                    Category = "Personal",
                    DueDate = DateTime.UtcNow.AddDays(3),
                    UserId = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new TaskManagement.Core.Models.Task
                {
                    Id = 3,
                    Title = "Admin Task",
                    Description = "Admin Description",
                    Status = "Pending",
                    Priority = "Low",
                    Category = "Work",
                    DueDate = DateTime.UtcNow.AddDays(5),
                    UserId = 2,
                    CreatedAt = DateTime.UtcNow
                }
            };

            _context.Tasks.AddRange(tasks);
            _context.SaveChanges();
        }

        public void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
    }
}