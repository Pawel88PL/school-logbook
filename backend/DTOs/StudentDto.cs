namespace backend.DTOs;

public class StudentDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public int ClassId { get; set; }
}
