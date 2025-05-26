using backend.DTOs;

namespace backend.Interfaces;

public interface IGradeService
{
    Task<GradeDto> AddGradeAsync(GradeCreateDto dto);
}