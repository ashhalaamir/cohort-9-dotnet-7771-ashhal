using System.ComponentModel.DataAnnotations;
using System.Text;

namespace TaskManagement.Core.Models
{
    public sealed class JwtSettings
    {
        [Required]
        public string Key { get; set; } = string.Empty;

        [Required]
        public string Issuer { get; set; } = string.Empty;

        [Required]
        public string Audience { get; set; } = string.Empty;

        [Range(1, 365)]
        public int ExpiryInDays { get; set; } = 7;

        public void Validate()
        {
            const int minimumKeyLength = 32;

            if (string.IsNullOrWhiteSpace(Key))
                throw new InvalidOperationException("JWT signing key is required and cannot be empty.");

            if (Key.Length < minimumKeyLength)
                throw new InvalidOperationException($"JWT signing key must be at least {minimumKeyLength} characters long.");

            if (Key == "YourSuperSecretKeyForDevelopment123!@#$%^&*()_+")
                throw new InvalidOperationException("A valid JWT signing key must be provided via environment or secret store. The development placeholder is not allowed.");

            var keyBytes = Encoding.UTF8.GetByteCount(Key);
            if (keyBytes < 32)
                throw new InvalidOperationException("JWT signing key must be at least 32 UTF-8 bytes long.");

            if (string.IsNullOrWhiteSpace(Issuer))
                throw new InvalidOperationException("JWT issuer is required and cannot be empty.");

            if (string.IsNullOrWhiteSpace(Audience))
                throw new InvalidOperationException("JWT audience is required and cannot be empty.");

            if (ExpiryInDays < 1 || ExpiryInDays > 365)
                throw new InvalidOperationException("JWT expiry must be between 1 and 365 days.");
        }
    }
}
