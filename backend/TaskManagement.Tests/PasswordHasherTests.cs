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
