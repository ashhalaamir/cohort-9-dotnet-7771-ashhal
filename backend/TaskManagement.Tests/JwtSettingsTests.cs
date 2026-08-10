using FluentAssertions;
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
