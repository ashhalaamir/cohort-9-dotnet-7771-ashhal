using FluentAssertions;
using Moq;
using TaskManagement.Core.Helpers;
using TaskManagement.Core.Interfaces;
using TaskManagement.Core.Models;
using TaskManagement.Core.Services;
using TaskManagement.Infrastructure.Repositories;
using Xunit;

namespace TaskManagement.Tests.Services
{
    public class AuthServiceTests : TestBase
    {
        private readonly IUserRepository _userRepository;
        private readonly JwtSettings _jwtSettings;
        private readonly IAuthService _authService;

        public AuthServiceTests()
        {
            _userRepository = new UserRepository(_context);
            
            _jwtSettings = new JwtSettings
            {
                Key = "TestSecretKeyForUnitTests1234567890123456",
                Issuer = "TestIssuer",
                Audience = "TestAudience",
                ExpiryInDays = 7
            };
            
            _authService = new AuthService(_userRepository, _jwtSettings);
        }

        [Fact]
        public async System.Threading.Tasks.Task Register_ValidUser_ReturnsUser()
        {
            // Arrange
            var username = "newuser";
            var email = "newuser@example.com";
            var password = "Test123!";

            // Act
            var result = await _authService.Register(username, email, password);

            // Assert
            result.Should().NotBeNull();
            result.Username.Should().Be(username);
            result.Email.Should().Be(email);
            result.Role.Should().Be("RegularUser");
            result.PasswordHash.Should().NotBeNullOrEmpty();
            result.PasswordHash.Should().NotBe(password);
        }

        [Fact]
        public async System.Threading.Tasks.Task Register_ExistingUser_ReturnsNull()
        {
            // Arrange
            var username = "testuser";
            var email = "test@example.com"; // Already seeded
            var password = "Test123!";

            // Act
            var result = await _authService.Register(username, email, password);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async System.Threading.Tasks.Task Login_ValidCredentials_ReturnsUser()
        {
            // Arrange
            var email = "logintest@example.com";
            var password = "LoginTest123!";
            var username = "logintestuser";
            
            // First register a user with a unique email
            var registerResult = await _authService.Register(username, email, password);
            
            // Make sure registration succeeded
            registerResult.Should().NotBeNull();
            
            // Act - Now login with the same credentials
            var result = await _authService.Login(email, password);

            // Assert
            result.Should().NotBeNull();
            result.Email.Should().Be(email);
            result.Username.Should().Be(username);
        }

        [Fact]
        public async System.Threading.Tasks.Task Login_InvalidEmail_ReturnsNull()
        {
            // Arrange
            var email = "nonexistent@example.com";
            var password = "Test123!";

            // Act
            var result = await _authService.Login(email, password);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async System.Threading.Tasks.Task Login_WrongPassword_ReturnsNull()
        {
            // Arrange
            var email = "logintest@example.com";
            var password = "WrongPassword!";
            
            // First register a user
            await _authService.Register("wrongpassworduser", email, "CorrectPassword123!");

            // Act - Login with wrong password
            var result = await _authService.Login(email, password);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public void GenerateJwtToken_ValidUser_ReturnsToken()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Username = "testuser",
                Email = "test@example.com",
                Role = "RegularUser"
            };

            // Act
            var token = _authService.GenerateJwtToken(user);

            // Assert
            token.Should().NotBeNullOrEmpty();
            token.Split('.').Should().HaveCount(3); // JWT has 3 parts
        }
    }
}