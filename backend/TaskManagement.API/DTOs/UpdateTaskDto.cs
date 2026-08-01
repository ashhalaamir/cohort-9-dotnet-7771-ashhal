using System.ComponentModel.DataAnnotations;
using TaskManagement.API.Validation;

namespace TaskManagement.API.DTOs
{
    public class UpdateTaskDto
    {
        [Required]
        public string Title { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public string Status { get; set; } = "Pending";
        public string Priority { get; set; } = "Medium";
        public string Category { get; set; } = string.Empty;

        [NotInPast]
        public DateTime DueDate { get; set; }
    }
}
