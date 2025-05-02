namespace backend.DTOs;

public class ClassDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int? HomeroomTeacherId { get; set; }
    public List<int> AssignedStudentIds { get; set; } = new List<int>();
}