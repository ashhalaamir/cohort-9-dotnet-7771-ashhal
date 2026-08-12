using FluentAssertions;
using TaskManagement.Core.Models;
using TaskManagement.Infrastructure.Repositories;
using Xunit;

namespace TaskManagement.Tests.Repositories
{
    public class TaskRepositoryTests : TestBase
    {
        private readonly TaskRepository _repository;

        public TaskRepositoryTests()
        {
            _repository = new TaskRepository(_context);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByIdAsync_ValidId_ReturnsTask()
        {
            // Arrange
            var taskId = 1;

            // Act
            var result = await _repository.GetByIdAsync(taskId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(taskId);
            result.Title.Should().Be("Test Task 1");
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAllAsync_ReturnsAllTasks()
        {
            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            result.Should().HaveCount(3);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByUserIdAsync_ValidUserId_ReturnsUserTasks()
        {
            // Arrange
            var userId = 1;

            // Act
            var result = await _repository.GetByUserIdAsync(userId);

            // Assert
            result.Should().HaveCount(2);
            result.Should().AllSatisfy(t => t.UserId.Should().Be(userId));
        }

        [Fact]
        public async System.Threading.Tasks.Task CreateAsync_ValidTask_AddsTask()
        {
            // Arrange
            var task = new TaskManagement.Core.Models.Task
            {
                Title = "New Task",
                Description = "New Desc",
                Status = "Pending",
                Priority = "Medium",
                Category = "Work",
                DueDate = DateTime.UtcNow.AddDays(7),
                UserId = 1
            };

            // Act
            var result = await _repository.CreateAsync(task);
            var allTasks = await _repository.GetAllAsync();

            // Assert
            result.Id.Should().BeGreaterThan(0);
            allTasks.Should().HaveCount(4);
        }

        [Fact]
        public async System.Threading.Tasks.Task UpdateAsync_ValidTask_UpdatesTask()
        {
            // Arrange
            var task = await _repository.GetByIdAsync(1);
            task.Title = "Updated Title";
            task.Status = "Completed";

            // Act
            var result = await _repository.UpdateAsync(task);
            var retrieved = await _repository.GetByIdAsync(1);

            // Assert
            result.Title.Should().Be("Updated Title");
            retrieved.Title.Should().Be("Updated Title");
        }

        [Fact]
        public async System.Threading.Tasks.Task DeleteAsync_ValidId_DeletesTask()
        {
            // Arrange
            var taskId = 1;

            // Act
            await _repository.DeleteAsync(taskId);
            var result = await _repository.GetByIdAsync(taskId);

            // Assert
            result.Should().BeNull();
        }
    }
}