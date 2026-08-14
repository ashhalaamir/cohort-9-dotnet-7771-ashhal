using System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.DTOs
{
    public class UpdateProfileDto
    {
        [MinLength(3, ErrorMessage = "Username must be at least 3 characters long.")]
        [MaxLength(50, ErrorMessage = "Username cannot exceed 50 characters.")]
        [RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Username can only contain letters, numbers, and underscores.")]
        public string? Username { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        [MaxLength(100, ErrorMessage = "Email cannot exceed 100 characters.")]
        public string? Email { get; set; }
    }
}