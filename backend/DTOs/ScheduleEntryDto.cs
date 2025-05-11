namespace backend.DTOs;

public class ScheduleEntryDto
{
    public int Id { get; set; }
    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan StartTime { get; set; }

    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = null!;

    public int TeacherId { get; set; }
    public string TeacherFullName { get; set; } = null!;
}