using backend.DTOs;

namespace backend.Interfaces;

public interface IStudentService
{
    Task<StudentDto?> GetStudentByIdAsync(string id);
    Task<IEnumerable<StudentDto>> GetStudentsAsync();
}