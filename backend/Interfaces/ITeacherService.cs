using backend.DTOs;

namespace backend.Interfaces;

public interface ITeacherService
{
    Task<TeacherDto?> GetTeacherByIdAsync(string id);
    Task<IEnumerable<TeacherDto>> GetTeachersAsync();
}