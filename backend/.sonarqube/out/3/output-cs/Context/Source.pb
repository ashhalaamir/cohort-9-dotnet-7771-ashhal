ž
gC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Tests\JwtSettingsTests.csusing FluentAssertions;
using TaskManagement.Core.Models;

namespace TaskManagement.Tests;

public class JwtSettingsTests
{
    [Fact]
    public void Validate_ThrowsWhenSigningKeyIsShorterThan32Utf8Bytes()
    {
        var settings = new JwtSettings
        {
            Key = "short-key",
            Issuer = "issuer",
            Audience = "audience"
        };

        Action act = () => settings.Validate();

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*at least 32 UTF-8 bytes*");
    }

    [Fact]
    public void Validate_AllowsSigningKeyWithAtLeast32Utf8Bytes()
    {
        var settings = new JwtSettings
        {
            Key = "0123456789abcdef0123456789abcdef",
            Issuer = "issuer",
            Audience = "audience"
        };

        var act = () => settings.Validate();

        act.Should().NotThrow();
    }
}
ParseOptions.0.jsonÙ
jC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Tests\PasswordHasherTests.csÕ
using System.Security.Cryptography;
using System.Text;
using FluentAssertions;
using TaskManagement.Core.Helpers;

namespace TaskManagement.Tests;

public class PasswordHasherTests
{
    [Fact]
    public void HashPassword_UsesPbkdf2WithReasonableIterations()
    {
        var hash = PasswordHasher.HashPassword("CorrectHorseBatteryStaple");

        hash.Should().StartWith("pbkdf2-sha256$");

        var parts = hash.Split('$', 4);
        parts.Should().HaveCount(4);

        int.TryParse(parts[1], out var iterations).Should().BeTrue();
        iterations.Should().BeGreaterOrEqualTo(600_000);
    }

    [Fact]
    public void VerifyPassword_ReturnsTrue_ForNewHash()
    {
        var password = "CorrectHorseBatteryStaple";
        var hash = PasswordHasher.HashPassword(password);

        PasswordHasher.VerifyPassword(password, hash).Should().BeTrue();
        PasswordHasher.VerifyPassword("WrongPassword", hash).Should().BeFalse();
    }

    [Fact]
    public void VerifyPassword_ReturnsTrue_ForLegacySha256Hash()
    {
        var password = "CorrectHorseBatteryStaple";
        using var sha256 = SHA256.Create();
        var legacyHash = Convert.ToBase64String(sha256.ComputeHash(Encoding.UTF8.GetBytes(password)));

        PasswordHasher.VerifyPassword(password, legacyHash).Should().BeTrue();
    }
}
ParseOptions.0.json©-
gC:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Tests\TaskServiceTests.cs¨,using System.Threading.Tasks;
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
    public async Task GetFilteredAsync_WithNullFilter_ThrowsArgumentNullException()
    {
        await Assert.ThrowsAsync<ArgumentNullException>(() => _taskService.GetFilteredAsync(null!, userId: 42, isAdmin: false));
        _taskRepository.Verify(x => x.GetFilteredAsync(It.IsAny<TaskFilterDto>(), It.IsAny<int>(), It.IsAny<bool>()), Times.Never);
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
ParseOptions.0.jsoní
`C:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Tests\UnitTest1.cstnamespace TaskManagement.Tests;

public class UnitTest1
{
    [Fact]
    public void Test1()
    {

    }
}ParseOptions.0.jsonä
sC:\Users\Ashhal\.nuget\packages\microsoft.net.test.sdk\17.8.0\build\netcoreapp3.1\Microsoft.NET.Test.Sdk.Program.cs×// <auto-generated> This file has been auto generated. </auto-generated>
using System;
[Microsoft.VisualStudio.TestPlatform.TestSDKAutoGeneratedCode]
class AutoGeneratedProgram {static void Main(string[] args){}}ParseOptions.0.jsonê
‹C:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Tests\obj\Debug\net8.0\TaskManagement.Tests.GlobalUsings.g.csÄ// <auto-generated/>
global using global::System;
global using global::System.Collections.Generic;
global using global::System.IO;
global using global::System.Linq;
global using global::System.Net.Http;
global using global::System.Threading;
global using global::System.Threading.Tasks;
global using global::Xunit;
ParseOptions.0.jsonô
“C:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Tests\obj\Debug\net8.0\.NETCoreApp,Version=v8.0.AssemblyAttributes.csÆ// <autogenerated />
using System;
using System.Reflection;
[assembly: global::System.Runtime.Versioning.TargetFrameworkAttribute(".NETCoreApp,Version=v8.0", FrameworkDisplayName = ".NET 8.0")]
ParseOptions.0.json®	
‰C:\IBA\10Pearls Internship\cohort-9-dotnet-7771-ashhal\backend\TaskManagement.Tests\obj\Debug\net8.0\TaskManagement.Tests.AssemblyInfo.csŠ//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

using System;
using System.Reflection;

[assembly: System.Reflection.AssemblyCompanyAttribute("TaskManagement.Tests")]
[assembly: System.Reflection.AssemblyConfigurationAttribute("Debug")]
[assembly: System.Reflection.AssemblyFileVersionAttribute("1.0.0.0")]
[assembly: System.Reflection.AssemblyInformationalVersionAttribute("1.0.0+0372add0d6ad8491e67f292ff4e627ecd3379b3e")]
[assembly: System.Reflection.AssemblyProductAttribute("TaskManagement.Tests")]
[assembly: System.Reflection.AssemblyTitleAttribute("TaskManagement.Tests")]
[assembly: System.Reflection.AssemblyVersionAttribute("1.0.0.0")]

// Generated by the MSBuild WriteCodeFragment class.

ParseOptions.0.json