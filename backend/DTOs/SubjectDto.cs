namespace backend.DTOs;

public class SubjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public List<SubjectAssignmentDto> Assignments { get; set; } = new();

}