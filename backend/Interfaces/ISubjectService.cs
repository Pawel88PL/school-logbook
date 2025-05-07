using backend.DTOs;

namespace backend.Interfaces;

public interface ISubjectService
{
    Task AddSubjectWithAssignmentsAsync(SubjectDto dto);
}