using FluentAssertions;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskManagement.Core.Services;
using TaskManagement.Infrastructure.Repositories;
using Xunit;

namespace TaskManagement.Tests.Services
{
    public class UserServiceTests : TestBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;

        public UserServiceTests()
        {
            _userRepository = new UserRepository(_context);
            _userService = new UserService(_userRepository);
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByIdAsync_ValidId_ReturnsUser()
        {
            // Arrange
            var userId = 1;

            // Act
            var result = await _userService.GetByIdAsync(userId);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(userId);
            result.Username.Should().Be("testuser");
            result.Email.Should().Be("test@example.com");
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByIdAsync_InvalidId_ReturnsNull()
        {
            // Arrange
            var userId = 999;

            // Act
            var result = await _userService.GetByIdAsync(userId);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByEmailAsync_ValidEmail_ReturnsUser()
        {
            // Arrange
            var email = "test@example.com";

            // Act
            var result = await _userService.GetByEmailAsync(email);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be(email);
            result.Username.Should().Be("testuser");
        }

        [Fact]
        public async System.Threading.Tasks.Task GetByEmailAsync_InvalidEmail_ReturnsNull()
        {
            // Arrange
            var email = "nonexistent@example.com";

            // Act
            var result = await _userService.GetByEmailAsync(email);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async System.Threading.Tasks.Task UpdateAsync_ValidUpdate_ReturnsUpdatedUser()
        {
            // Arrange
            var user = await _userService.GetByIdAsync(1);
            user.Username = "updateduser";
            user.Email = "updated@example.com";

            // Act
            var result = await _userService.UpdateAsync(user);

            // Assert
            result.Should().NotBeNull();
            result.Username.Should().Be("updateduser");
            result.Email.Should().Be("updated@example.com");
        }

        [Fact]
        public async System.Threading.Tasks.Task CreateAsync_ValidUser_ReturnsUser()
        {
            // Arrange
            var user = new User
            {
                Username = "brandnewuser",
                Email = "brandnew@example.com",
                PasswordHash = "hashedpassword",
                Role = "RegularUser"
            };

            // Act
            var result = await _userService.CreateAsync(user);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().BeGreaterThan(0);
            result.Username.Should().Be("brandnewuser");
        }
    }
}