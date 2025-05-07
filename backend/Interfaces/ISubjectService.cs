using backend.DTOs;
using backend.Models;

namespace backend.Interfaces;

public interface ISubjectService
{
    Task AddSubjectWithAssignmentsAsync(SubjectDto dto);
    Task<PagedSubjects> GetSubjectsPaged(PagedRequest request);
}