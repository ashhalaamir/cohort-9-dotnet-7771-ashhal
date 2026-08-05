using System.Threading.Tasks;
using FluentAssertions;
using Moq;
using TaskManagement.Core.DTOs;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Services;
using TaskEntity = TaskManagement.Core.Models.Task;

namespace TaskManagement.Tests;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _taskRepository;
    private readonly Mock<IUserRepository> _userRepository;
    private readonly TaskService _taskService;

    public TaskServiceTests()
    {
        _taskRepository = new Mock<ITaskRepository>();
        _userRepository = new Mock<IUserRepository>();
        _taskService = new TaskService(_taskRepository.Object, _userRepository.Object);
    }

    [Fact]
    public async Task GetAllAsync_AsAdmin_ReturnsAllTasks()
    {
        var tasks = new[]
        {
            new TaskEntity { Id = 1, UserId = 1, Title = "Task 1" },
            new TaskEntity { Id = 2, UserId = 2, Title = "Task 2" }
        };

        _taskRepository.Setup(x => x.GetAllAsync()).ReturnsAsync(tasks);

        var result = await _taskService.GetAllAsync(userId: 99, isAdmin: true);

        result.Should().BeEquivalentTo(tasks);
    }

    [Fact]
    public async Task GetAllAsync_AsRegularUser_ReturnsOnlyTheirTasks()
    {
        var userTasks = new[]
        {
            new TaskEntity { Id = 11, UserId = 11, Title = "User Task" }
        };

        _taskRepository.Setup(x => x.GetByUserIdAsync(11)).ReturnsAsync(userTasks);

        var result = await _taskService.GetAllAsync(userId: 11, isAdmin: false);

        result.Should().BeEquivalentTo(userTasks);
    }

    [Fact]
    public async Task UpdateAsync_AsRegularUser_CannotUpdateAnotherUsersTask()
    {
        var existingTask = new TaskEntity { Id = 5, UserId = 10, Title = "Existing" };
        var update = new TaskEntity { Title = "Updated", Description = "New" };

        _taskRepository.Setup(x => x.GetByIdAsync(5)).ReturnsAsync(existingTask);

        var result = await _taskService.UpdateAsync(5, update, userId: 11, isAdmin: false);

        result.Should().BeNull();
        _taskRepository.Verify(x => x.UpdateAsync(It.IsAny<TaskEntity>()), Times.Never);
    }

    [Fact]
    public async Task UpdateAsync_AsAdmin_CanUpdateAnyTask()
    {
        var existingTask = new TaskEntity { Id = 5, UserId = 10, Title = "Existing" };
        var update = new TaskEntity { Title = "Updated", Description = "New", Status = "Done", Priority = "High", Category = "Work", DueDate = DateTime.UtcNow.AddDays(1) };

        _taskRepository.Setup(x => x.GetByIdAsync(5)).ReturnsAsync(existingTask);
        _taskRepository.Setup(x => x.UpdateAsync(It.IsAny<TaskEntity>())).ReturnsAsync((TaskEntity t) => t);

        var result = await _taskService.UpdateAsync(5, update, userId: 99, isAdmin: true);

        result.Should().NotBeNull();
        result!.Title.Should().Be("Updated");
        result.Status.Should().Be("Done");
        _taskRepository.Verify(x => x.UpdateAsync(It.Is<TaskEntity>(t => t.Id == 5 && t.UserId == 10)), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_AsRegularUser_CannotDeleteAnotherUsersTask()
    {
        var existingTask = new TaskEntity { Id = 20, UserId = 30, Title = "Other Task" };
        _taskRepository.Setup(x => x.GetByIdAsync(20)).ReturnsAsync(existingTask);

        var result = await _taskService.DeleteAsync(20, userId: 31, isAdmin: false);

        result.Should().BeFalse();
        _taskRepository.Verify(x => x.DeleteAsync(It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_AsAdmin_CanDeleteAnyTask()
    {
        var existingTask = new TaskEntity { Id = 20, UserId = 30, Title = "Task" };
        _taskRepository.Setup(x => x.GetByIdAsync(20)).ReturnsAsync(existingTask);

        var result = await _taskService.DeleteAsync(20, userId: 99, isAdmin: true);

        result.Should().BeTrue();
        _taskRepository.Verify(x => x.DeleteAsync(20), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_AssignsCurrentUserId()
    {
        var task = new TaskEntity { Title = "New", Description = "Task", DueDate = DateTime.UtcNow.AddDays(1) };
        _taskRepository.Setup(x => x.CreateAsync(It.IsAny<TaskEntity>())).ReturnsAsync((TaskEntity t) =>
        {
            t.Id = 50;
            return t;
        });

        var result = await _taskService.CreateAsync(task, userId: 42);

        result.UserId.Should().Be(42);
        result.Id.Should().Be(50);
    }

    [Fact]
    public async Task GetFilteredAsync_DelegatesToRepository()
    {
        var filter = new TaskFilterDto { Status = "Pending", Search = "foo" };
        var tasks = new[]
        {
            new TaskEntity { Id = 1, UserId = 42, Title = "Foo Task", Status = "Pending", DueDate = DateTime.UtcNow.AddDays(1) }
        };

        _taskRepository.Setup(x => x.GetFilteredAsync(filter, 42, false)).ReturnsAsync(tasks);

        var result = await _taskService.GetFilteredAsync(filter, userId: 42, isAdmin: false);

        result.Should().BeEquivalentTo(tasks);
        _taskRepository.Verify(x => x.GetFilteredAsync(filter, 42, false), Times.Once);
    }
}
