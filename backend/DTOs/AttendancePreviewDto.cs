using backend.Models.Entities;

namespace backend.DTOs;

public class AttendancePreviewDto
{
    public DateTime Date { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public AttendanceStatus? Status { get; set; }
}

public class PagedAttendance
{
    public int TotalRecords { get; set; }
    public List<AttendancePreviewDto> Data { get; set; } = [];
}
