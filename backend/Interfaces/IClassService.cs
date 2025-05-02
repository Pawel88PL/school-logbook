using backend.DTOs;
using backend.Models;

namespace backend.Interfaces;

public interface IClassService
{
    Task AddClass(ClassDto classDto);
    Task<PagedClasses> GetClassesPaged(PagedRequest request);
}