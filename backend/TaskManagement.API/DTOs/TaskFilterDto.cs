namespace TaskManagement.API.DTOs
{
    public class TaskFilterDto
    {
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public string? Category { get; set; }
        public string? Search { get; set; }
        public DateTime? DueDateFrom { get; set; }
        public DateTime? DueDateTo { get; set; }
        public string? SortBy { get; set; } // "dueDate", "priority", "status", "createdAt"
        public string? SortOrder { get; set; } // "asc" or "desc"
    }
}