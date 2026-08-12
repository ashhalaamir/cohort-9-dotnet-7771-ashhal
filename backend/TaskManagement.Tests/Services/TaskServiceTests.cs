using FluentAssertions;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskManagement.Core.Services;
using TaskManagement.Infrastructure.Repositories;
using Xunit;

namespace TaskManagement.Tests.Services
{
    public class TaskServiceTests : TestBase
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository;
        private readonly ITaskService _taskService;

        public TaskServiceTests()
        {
            _taskRepository = new TaskRepository(_context);
            _userRepository = new UserRepository(_context);
            // 🔥 FIXED: Added IUserRepository parameter
            _taskService = new TaskService(_taskRepository, _userRepository);
        }

        [Fact]
        public async System.Threading.Tasks.Task CreateAsync_ValidTask_ReturnsTask()
        {
            // Arrange
            var task = new TaskManagement.Core.Models.Task
            {
                Title = "New Test Task",
                Description = "New Description",
                Status = "Pending",
                Priority = "Medium",
                Category = "Work",
                DueDate = DateTime.UtcNow.AddDays(10),
                UserId = 1
            };

            // Act
            var result = await _taskService.CreateAsync(task, task.UserId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().BeGreaterThan(0);
            result.Title.Should().Be("New Test Task");
            result.UserId.Should().Be(1);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByIdAsync_ValidId_ReturnsTask()
        {
            // Arrange
            var taskId = 1;
            var userId = 1;
            var isAdmin = false;

            // Act
            var result = await _taskService.GetByIdAsync(taskId, userId, isAdmin);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(taskId);
            result.Title.Should().Be("Test Task 1");
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByIdAsync_WrongUser_ReturnsNull()
        {
            // Arrange
            var taskId = 1; // Task belongs to user 1
            var userId = 3; // Different user
            var isAdmin = false;

            // Act
            var result = await _taskService.GetByIdAsync(taskId, userId, isAdmin);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByIdAsync_Admin_ReturnsAnyTask()
        {
            // Arrange
            var taskId = 1; // Task belongs to user 1
            var userId = 3; // Admin user
            var isAdmin = true;

            // Act
            var result = await _taskService.GetByIdAsync(taskId, userId, isAdmin);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(taskId);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAllAsync_RegularUser_ReturnsOwnTasks()
        {
            // Arrange
            var userId = 1;
            var isAdmin = false;

            // Act
            var results = await _taskService.GetAllAsync(userId, isAdmin);

            // Assert
            results.Should().NotBeNull();
            results.Should().AllSatisfy(t => t.UserId.Should().Be(userId));
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAllAsync_Admin_ReturnsAllTasks()
        {
            // Arrange
            var userId = 2; // Admin user
            var isAdmin = true;

            // Act
            var results = await _taskService.GetAllAsync(userId, isAdmin);

            // Assert
            results.Should().NotBeNull();
            results.Should().HaveCount(3); // All seeded tasks
        }

        [Fact]
        public async System.Threading.Tasks.Task UpdateAsync_ValidUpdate_ReturnsUpdatedTask()
        {
            // Arrange
            var taskId = 1;
            var userId = 1;
            var isAdmin = false;
            var updatedTask = new TaskManagement.Core.Models.Task
            {
                Title = "Updated Title",
                Description = "Updated Description",
                Status = "Completed",
                Priority = "Low",
                Category = "Personal",
                DueDate = DateTime.UtcNow.AddDays(1)
            };

            // Act
            var result = await _taskService.UpdateAsync(taskId, updatedTask, userId, isAdmin);

            // Assert
            result.Should().NotBeNull();
            result.Title.Should().Be("Updated Title");
            result.Status.Should().Be("Completed");
            result.UpdatedAt.Should().NotBeNull();
        }

        [Fact]
        public async System.Threading.Tasks.Task UpdateAsync_WrongUser_ReturnsNull()
        {
            // Arrange
            var taskId = 1;
            var userId = 3; // Different user
            var isAdmin = false;
            var updatedTask = new TaskManagement.Core.Models.Task
            {
                Title = "Updated Title",
                Description = "Updated Description",
                Status = "Completed",
                Priority = "Low",
                Category = "Personal",
                DueDate = DateTime.UtcNow.AddDays(1)
            };

            // Act
            var result = await _taskService.UpdateAsync(taskId, updatedTask, userId, isAdmin);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async System.Threading.Tasks.Task DeleteAsync_ValidOwner_ReturnsTrue()
        {
            // Arrange
            var taskId = 2; // Task belongs to user 1
            var userId = 1;
            var isAdmin = false;

            // Act
            var result = await _taskService.DeleteAsync(taskId, userId, isAdmin);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public async System.Threading.Tasks.Task DeleteAsync_WrongUser_ReturnsFalse()
        {
            // Arrange
            var taskId = 1; // Task belongs to user 1
            var userId = 3; // Different user
            var isAdmin = false;

            // Act
            var result = await _taskService.DeleteAsync(taskId, userId, isAdmin);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async System.Threading.Tasks.Task AssignTaskAsync_Admin_AssignsTask()
        {
            // Arrange
            var taskId = 1;
            var assignToUserId = 2;
            var adminUserId = 3;
            var isAdmin = true; // 🔥 FIXED: Added isAdmin parameter

            // Act
            var result = await _taskService.AssignTaskAsync(taskId, assignToUserId, adminUserId, isAdmin);

            // Assert
            result.Should().NotBeNull();
            result.UserId.Should().Be(assignToUserId);
        }
    }
}