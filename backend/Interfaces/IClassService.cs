using backend.DTOs;

namespace backend.Interfaces;

public interface IClassService
{
    Task AddClass(ClassDto classDto);
}