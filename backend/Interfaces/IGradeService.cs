using backend.DTOs;

namespace backend.Interfaces;

public interface IGradeService
{
    Task<GradeDto> AddGradeAsync(GradeCreateDto dto, int teacherId);
    Task<List<StudentDto>> GetStudentsForSubjectAndClassAsync(int teacherId, int subjectId, int classId);
    Task<List<SubjectWithClassDto>> GetSubjectsForCurrentTeacherAsync(int teacherId);
}