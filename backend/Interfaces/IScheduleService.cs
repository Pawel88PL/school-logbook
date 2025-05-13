using backend.DTOs;

namespace backend.Interfaces;

public interface IScheduleService
{
    Task<ScheduleEntryDto> AddEntryAsync(ScheduleEntryDto dto);
    Task<List<ClassWithScheduleDto>> GetClassesWithScheduleAsync();
    Task<ScheduleForClassDto?> GetScheduleForClassAsync(int classId);
    Task<List<SubjectWithTeachersDto>> GetSubjectsForClassAsync(int classId);
}