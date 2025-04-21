namespace backend.Models.Entities;

public class Schedule
{
    public int Id { get; set; }

    public int ClassId { get; set; }
    public Class Class { get; set; } = null!;

    public int SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

    public int TeacherId { get; set; }
    public Teacher Teacher { get; set; } = null!;

    public DayOfWeek DayOfWeek { get; set; }
    public TimeSpan Time { get; set; } // np. 08:00

    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}