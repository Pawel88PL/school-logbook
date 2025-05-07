using backend.DTOs;
using backend.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            return Problem(detail: ex.Message, statusCode: 500, title: "Błąd serwera");
        }
    }
}