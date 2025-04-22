namespace backend.Models.Entities;

public class Student
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;

    public int ClassId { get; set; }
    public Class Class { get; set; } = null!;

    public string? UserId { get; set; }
    public User? User { get; set; }

    public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
}