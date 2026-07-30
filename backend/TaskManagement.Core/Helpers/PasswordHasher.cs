using System.Security.Cryptography;
using System.Text;

namespace TaskManagement.Core.Helpers
{
    public static class PasswordHasher
    {
        private const string Pbkdf2Identifier = "pbkdf2-sha256";
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

            return string.Join('$', Pbkdf2Identifier, Iterations, Convert.ToBase64String(salt), Convert.ToBase64String(key));
        }

        /// <summary>
        /// Verifies a password against the stored hash, supporting PBKDF2 and legacy SHA256 hashes.
        /// </summary>
        public static bool VerifyPassword(string password, string hashedPassword)
        {
            ArgumentNullException.ThrowIfNull(password);
            ArgumentNullException.ThrowIfNull(hashedPassword);

            if (hashedPassword.StartsWith(Pbkdf2Identifier + '$', StringComparison.Ordinal))
            {
                var parts = hashedPassword.Split('$', 4);
                if (parts.Length != 4)
                    return false;

                if (!int.TryParse(parts[1], out var iterations) || iterations <= 0)
                    return false;

                try
                {
                    var salt = Convert.FromBase64String(parts[2]);
                    var storedKey = Convert.FromBase64String(parts[3]);

                    using var deriveBytes = new Rfc2898DeriveBytes(password, salt, iterations, HashAlgorithmName.SHA256);
                    var computedKey = deriveBytes.GetBytes(storedKey.Length);

                    return CryptographicOperations.FixedTimeEquals(computedKey, storedKey);
                }
                catch (FormatException)
                {
                    return false;
                }
            }

            // Legacy SHA256 hash support.
            try
            {
                using var sha256 = SHA256.Create();
                var computedHash = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                var computedBase64 = Convert.ToBase64String(computedHash);
                return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(computedBase64), Encoding.UTF8.GetBytes(hashedPassword));
            }
            catch
            {
                return false;
            }
        }
    }
}