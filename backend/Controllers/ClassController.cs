using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Administrator")]
public class ClassController(IClassService classService) : ControllerBase
{
    private readonly IClassService _classService = classService;

    [HttpPost("add")]
    public async Task<IActionResult> AddClass([FromBody] ClassDto classDto)
    {
        try
        {
            await _classService.AddClass(classDto);
            return Ok(new { message = "Klasa została dodana pomyślnie." });
        }
        catch (Exception e)
        {
            var message = $"Wystąpił błąd podczas dodawania klasy: {e.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [HttpGet("paged")]
    public async Task<IActionResult> GetClassesPaged([FromQuery] PagedRequest pagedRequest)
    {
        try
        {
            var classes = await _classService.GetClassesPaged(pagedRequest);
            return Ok(classes);
        }
        catch (Exception e)
        {
            var message = $"Wystąpił błąd podczas pobierania klas: {e.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }
}