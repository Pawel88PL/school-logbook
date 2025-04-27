using AutoMapper;
using backend.DTOs;
using backend.Interfaces.Repositories;
using backend.Interfaces.Services;
using backend.Models.Entities;

namespace backend.Services.Implementations;

public class AttendanceService : IAttendanceService
{
    private readonly IAttendanceRepository _repository;
    private readonly IMapper _mapper;

    public AttendanceService(IAttendanceRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task AddAttendanceAsync(AttendanceDto dto)
    {
        var attendance = _mapper.Map<Attendance>(dto);
        await _repository.AddAsync(attendance);
    }

    public async Task<List<AttendanceDto>> GetAttendanceForStudentAsync(int studentId)
    {
        var list = await _repository.GetByStudentIdAsync(studentId);
        return _mapper.Map<List<AttendanceDto>>(list);
    }
}
