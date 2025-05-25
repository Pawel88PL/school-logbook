namespace backend.DTOs;

public class LessonForAttendanceDto
{
    public int ScheduleId { get; set; }
    public string SubjectName { get; set; } = null!;
    public string ClassName { get; set; } = null!;
    public TimeSpan StartTime { get; set; }
}
