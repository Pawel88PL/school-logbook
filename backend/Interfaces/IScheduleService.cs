using backend.DTOs;

namespace backend.Interfaces;

public interface IScheduleService
{
    Task<List<ClassWithScheduleDto>> GetClassesWithScheduleAsync();

}