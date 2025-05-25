using backend.Models.Entities;

namespace backend.DTOs;

public class AttendanceCreateDto
{
    public int StudentId { get; set; }
    public AttendanceStatus Status { get; set; }
}