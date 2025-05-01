using backend.DTOs;

namespace backend.Interfaces;

public interface ITeacherService
{
    Task<IEnumerable<TeacherDto>> GetTeachersAsync();
}