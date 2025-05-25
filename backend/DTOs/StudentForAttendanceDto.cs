using backend.Models.Entities;

namespace backend.DTOs;

public class StudentForAttendanceDto
{
    public int StudentId { get; set; }
    public string FullName { get; set; } = null!;
    public AttendanceStatus Status { get; set; } // null jeśli jeszcze nie zarejestrowano
}
