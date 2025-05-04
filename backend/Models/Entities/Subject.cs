namespace backend.Models.Entities;

public class Subject
{
    public int Id { get; set; }
    public string Name { get; set; } = null!; // np. Matematyka

    public ICollection<ClassSubject> ClassSubjects { get; set; } = new List<ClassSubject>();
    public ICollection<Schedule> Schedules { get; set; } = new List<Schedule>();
}
