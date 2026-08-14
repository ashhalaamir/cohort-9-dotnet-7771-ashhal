namespace TaskManagement.API.DTOs
{
    public class DashboardStatsDto
    {
        public int TotalTasks { get; set; }
        public int Completed { get; set; }
        public int InProgress { get; set; }
        public int Pending { get; set; }
    }
}