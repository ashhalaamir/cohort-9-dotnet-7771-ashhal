using FluentAssertions;
using TaskManagement.Core.Helpers;
using Xunit;

namespace TaskManagement.Tests.Helpers
{
    public class PasswordHasherTests
    {
        [Fact]
        public void HashPassword_ValidPassword_ReturnsHashed()
        {
            // Arrange
            var password = "Test123!";

            // Act
            var hashed = PasswordHasher.HashPassword(password);

            // Assert
            hashed.Should().NotBeNullOrEmpty();
            hashed.Should().NotBe(password);
            hashed.Should().StartWith("pbkdf2-sha256$");
        }

        [Fact]
        public void HashPassword_SamePassword_ReturnsDifferentHashes()
        {
            // Arrange
            var password = "Test123!";

            // Act
            var hash1 = PasswordHasher.HashPassword(password);
            var hash2 = PasswordHasher.HashPassword(password);

            // Assert
            hash1.Should().NotBe(hash2);
        }

        [Fact]
        public void VerifyPassword_CorrectPassword_ReturnsTrue()
        {
            // Arrange
            var password = "Test123!";
            var hashed = PasswordHasher.HashPassword(password);

            // Act
            var result = PasswordHasher.VerifyPassword(password, hashed);

            // Assert
            result.Should().BeTrue();
        }

        [Fact]
        public void VerifyPassword_WrongPassword_ReturnsFalse()
        {
            // Arrange
            var password = "Test123!";
            var hashed = PasswordHasher.HashPassword(password);
            var wrongPassword = "WrongPassword!";

            // Act
            var result = PasswordHasher.VerifyPassword(wrongPassword, hashed);

            // Assert
            result.Should().BeFalse();
        }
    }
}