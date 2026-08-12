using FluentAssertions;
using TaskManagement.Core.Models;
using TaskManagement.Infrastructure.Repositories;
using Xunit;

namespace TaskManagement.Tests.Repositories
{
    public class UserRepositoryTests : TestBase
    {
        private readonly UserRepository _repository;

        public UserRepositoryTests()
        {
            _repository = new UserRepository(_context);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByIdAsync_ValidId_ReturnsUser()
        {
            // Arrange
            var userId = 1;

            // Act
            var result = await _repository.GetByIdAsync(userId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(userId);
            result.Username.Should().Be("testuser");
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByEmailAsync_ValidEmail_ReturnsUser()
        {
            // Arrange
            var email = "test@example.com";

            // Act
            var result = await _repository.GetByEmailAsync(email);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be(email);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetAllAsync_ReturnsAllUsers()
        {
            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            result.Should().HaveCount(2);
        }

        [Fact]
        public async System.Threading.Tasks.Task CreateAsync_ValidUser_AddsUser()
        {
            // Arrange
            var user = new User
            {
                Username = "newuser",
                Email = "new@example.com",
                PasswordHash = "hashed",
                Role = "RegularUser"
            };

            // Act
            var result = await _repository.CreateAsync(user);
            var allUsers = await _repository.GetAllAsync();

            // Assert
            result.Id.Should().BeGreaterThan(0);
            allUsers.Should().HaveCount(3);
        }

        [Fact]
        public async System.Threading.Tasks.Task UpdateAsync_ValidUser_UpdatesUser()
        {
            // Arrange
            var user = await _repository.GetByIdAsync(1);
            user.Username = "updatedusername";

            // Act
            var result = await _repository.UpdateAsync(user);
            var retrieved = await _repository.GetByIdAsync(1);

            // Assert
            result.Username.Should().Be("updatedusername");
            retrieved.Username.Should().Be("updatedusername");
        }

        [Fact]
        public async System.Threading.Tasks.Task DeleteAsync_ValidId_DeletesUser()
        {
            // Arrange
            var userId = 1;

            // Act
            await _repository.DeleteAsync(userId);
            var result = await _repository.GetByIdAsync(userId);

            // Assert
            result.Should().BeNull();
        }
    }
}