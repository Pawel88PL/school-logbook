using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrator, Teacher")]
public class SubjectController(ISubjectService subjectService) : ControllerBase
{
    private readonly ISubjectService _subjectService = subjectService;

    [HttpPost("add")]
    public async Task<IActionResult> AddSubjectWithAssignments([FromBody] SubjectDto dto)
    {
        if (dto == null)
        {
            return BadRequest("Niepoprawne dane wejściowe.");
        }

        try
        {
            await _subjectService.AddSubjectWithAssignmentsAsync(dto);
            return Ok(new { message = "Przedmiot został dodany pomyślnie." });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas dodawania przedmiotu z przypisaniami");
            return Problem(detail: ex.Message, statusCode: 500, title: "Błąd serwera");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteSubject(int id)
    {
        try
        {
            await _subjectService.DeleteSubjectAsync(id);
            return Ok(new { message = "Przedmiot został usunięty." });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas usuwania przedmiotu");
            return StatusCode(500, new { message = $"Wystąpił błąd: {ex.Message}" });
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetSubjectById(int id)
    {
        try
        {
            var subject = await _subjectService.GetSubjectByIdAsync(id);
            if (subject == null)
            {
                return NotFound(new { message = "Nie znaleziono przedmiotu." });
            }
            return Ok(subject);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas pobierania przedmiotu");
            return Problem(detail: ex.Message, statusCode: 500, title: "Błąd serwera");
        }
    }


    [HttpGet("paged")]
    public async Task<IActionResult> GetSubjectsPaged([FromQuery] PagedRequest request)
    {
        try
        {
            var result = await _subjectService.GetSubjectsPaged(request);
            return Ok(result);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas pobierania przedmiotów");
            return Problem(detail: ex.Message, statusCode: 500, title: "Błąd serwera");
        }
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateSubjectWithAssignments([FromBody] SubjectDto dto)
    {
        if (dto == null)
        {
            return BadRequest("Niepoprawne dane wejściowe.");
        }

        try
        {
            await _subjectService.UpdateSubjectWithAssignmentsAsync(dto);
            return Ok(new { message = "Przedmiot został zaktualizowany." });
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Błąd podczas aktualizacji przedmiotu z przypisaniami");
            return Problem(detail: ex.Message, statusCode: 500, title: "Błąd serwera");
        }
    }
}