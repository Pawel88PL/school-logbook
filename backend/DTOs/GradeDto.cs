namespace backend.DTOs;

public class GradeDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int SubjectId { get; set; }
    public int TeacherId { get; set; }
    public double Value { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
}
