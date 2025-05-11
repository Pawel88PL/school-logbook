namespace backend.DTOs;

public class ClassWithScheduleDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public bool HasSchedule { get; set; }
}
