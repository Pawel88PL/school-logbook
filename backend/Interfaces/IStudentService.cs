using backend.DTOs;

namespace backend.Interfaces;

public interface IStudentService
{
    Task<IEnumerable<StudentDto>> GetStudentsAsync();
}