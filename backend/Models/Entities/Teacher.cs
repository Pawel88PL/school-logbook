namespace backend.Models.Entities;

public class Teacher
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;

    public ICollection<Schedule> Lessons { get; set; } = new List<Schedule>();
    public ICollection<Class> HomeroomClasses { get; set; } = new List<Class>();
}
