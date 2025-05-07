using backend.DTOs;
using backend.Models;

namespace backend.Interfaces;

public interface IClassService
{
    Task AddClass(ClassDto classDto);
    Task DeleteClass(int id);
    Task<ClassDto> GetClassById(int id);
    Task<IEnumerable<ClassDto>> GetClassesAsync();
    Task<PagedClasses> GetClassesPaged(PagedRequest request);
    Task UpdateClass(ClassDto classDto);
}