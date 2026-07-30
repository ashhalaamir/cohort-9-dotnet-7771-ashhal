using System.Security.Cryptography;
using System.Text;

namespace TaskManagement.Core.Helpers
{
    public static class PasswordHasher
    {
        private const int SaltSize = 16; // 128-bit salt
        private const int KeySize = 32; // 256-bit key
        private const int Iterations = 100_000;

        /// <summary>
        /// Hashes a password using PBKDF2 with a per-password salt.
        /// </summary>
        public static string HashPassword(string password)
        {
            ArgumentNullException.ThrowIfNull(password);

            using var deriveBytes = new Rfc2898DeriveBytes(password, SaltSize, Iterations, HashAlgorithmName.SHA256);
            var salt = deriveBytes.Salt;
            var key = deriveBytes.GetBytes(KeySize);

            return string.Join('.', Iterations, Convert.ToBase64String(salt), Convert.ToBase64String(key));
        }

        /// <summary>
        /// Verifies a password against a PBKDF2 hash using constant-time comparison.
        /// </summary>
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            ArgumentNullException.ThrowIfNull(password);
            ArgumentNullException.ThrowIfNull(hashedPassword);

            var parts = hashedPassword.Split('.', 3);
            if (parts.Length != 3)
                return false;

            if (!int.TryParse(parts[0], out var iterations) || iterations <= 0)
                return false;

            try
            {
                var salt = Convert.FromBase64String(parts[1]);
                var storedKey = Convert.FromBase64String(parts[2]);

                using var deriveBytes = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
                var computedKey = deriveBytes.GetBytes(storedKey.Length);

                return CryptographicOperations.FixedTimeEquals(computedKey, storedKey);
            }
            catch (FormatException)
            {
                return false;
            }
        }
    }
}