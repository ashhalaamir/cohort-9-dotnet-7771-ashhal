using FluentAssertions;
using TaskManagement.Core.Models;
using Xunit;

namespace TaskManagement.Tests
{
    public class JwtSettingsTests
    {
        [Fact]
        public void Validate_ThrowsWhenSigningKeyIsShorterThan32Utf8Bytes()
        {
            // Arrange
            var settings = new JwtSettings
            {
                Key = "short",
                Issuer = "TestIssuer",
                Audience = "TestAudience",
                ExpiryInDays = 7
            };

            // Act
            var act = () => settings.Validate();

            // Assert
            act.Should().Throw<InvalidOperationException>()
                .WithMessage("JWT signing key must be at least 32 characters long.");
        }

        [Fact]
        public void Validate_DoesNotThrowWhenSigningKeyIsLongEnough()
        {
            // Arrange
            var settings = new JwtSettings
            {
                Key = "01234567890123456789012345678901", // 32 characters
                Issuer = "TestIssuer",
                Audience = "TestAudience",
                ExpiryInDays = 7
            };

            // Act
            var act = () => settings.Validate();

            // Assert
            act.Should().NotThrow();
        }
    }
}