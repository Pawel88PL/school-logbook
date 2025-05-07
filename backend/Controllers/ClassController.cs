using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClassController(IClassService classService) : ControllerBase
{
    private readonly IClassService _classService = classService;

    [Authorize(Roles = "Administrator")]
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

    [Authorize(Roles = "Administrator")]
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteClass(int id)
    {
        try
        {
            await _classService.DeleteClass(id);
            return Ok(new { message = "Klasa została usunięta pomyślnie." });
        }
        catch (Exception e)
        {
            var message = $"Wystąpił błąd podczas usuwania klasy: {e.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [Authorize(Roles = "Administrator, Teacher")]
    [HttpGet("get/{id}")]
    public async Task<IActionResult> GetClassById(int id)
    {
        try
        {
            var classDto = await _classService.GetClassById(id);
            if (classDto == null)
            {
                return NotFound(new { message = "Nie znaleziono klasy o podanym identyfikatorze." });
            }
            return Ok(classDto);
        }
        catch (Exception e)
        {
            var message = $"Wystąpił błąd podczas pobierania klasy: {e.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [Authorize(Roles = "Administrator, Teacher")]
    [HttpGet("all")]
    public async Task<IActionResult> GetClasses()
    {
        try
        {
            var classes = await _classService.GetClassesAsync();
            return Ok(classes);
        }
        catch (Exception e)
        {
            var message = $"Wystąpił błąd podczas pobierania klas: {e.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }

    [Authorize(Roles = "Administrator")]
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

    [Authorize(Roles = "Administrator")]
    [HttpPut("update")]
    public async Task<IActionResult> UpdateClass([FromBody] ClassDto classDto)
    {
        try
        {
            await _classService.UpdateClass(classDto);
            return Ok(new { message = "Klasa została zaktualizowana pomyślnie." });
        }
        catch (Exception e)
        {
            var message = $"Wystąpił błąd podczas aktualizacji klasy: {e.Message}";
            Log.Error(message);
            return BadRequest(new { message });
        }
    }
}