namespace backend.Models.Entities;

public class Class
{
    public int Id { get; set; }
    public string Name { get; set; } = null!; // np. "2B"

    public int? HomeroomTeacherId { get; set; }
    public Teacher? HomeroomTeacher { get; set; }

    public ICollection<Student> Students { get; set; } = new List<Student>();
    public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}