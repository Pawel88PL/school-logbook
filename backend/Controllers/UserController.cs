using System.Security.Claims;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Administrator")]
        [HttpPost("add")]
        public async Task<IActionResult> AddNewUser([FromBody] AddUserModel addUserModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (addUserModel.Email == null)
            {
                return BadRequest("Brak nazwy użytkownika w zapytaniu.");
            }

            var result = await _userService.AddNewUserAsync(addUserModel);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok();
        }

        [Authorize(Roles = "Administrator")]
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            if (id == null)
            {
                return BadRequest(new { message = "Brak identyfikatora użytkownika w zapytaniu." });
            }

            try
            {
                var result = await _userService.DeleteUserAsync(id);
                if (!result.Succeeded)
                {
                    return BadRequest(result.Errors);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Wystąpił błąd podczas usuwania użytkownika.");
                return StatusCode(500, new { message = "Wystąpił błąd podczas usuwania użytkownika. " + ex.Message });
            }
        }

        [HttpGet("logged-user")]
        public async Task<IActionResult> GetLoggedUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null)
            {
                return BadRequest("Brak identyfikatora użytkownika w zapytaniu.");
            }

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Nie znaleziono użytkownika.");
            }

            return Ok(user);
        }

        [Authorize(Roles = "Administrator")]
        [HttpGet("paged")]
        public async Task<IActionResult> GetUsersPaged([FromQuery] PagedRequest pagedRequest)
        {
            try
            {
                var users = await _userService.GetUsersPaged(pagedRequest);
                return Ok(users);
            }
            catch (Exception e)
            {
                var message = $"Wystąpił błąd podczas pobierania użytkowników: {e.Message}";
                Log.Error(message);
                return BadRequest(new { message });
            }
        }

        [Authorize(Roles = "Administrator")]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUser updateUser)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var updateResult = await _userService.UpdateUserAsync(updateUser);
                if (!updateResult)
                {
                    return BadRequest("Nie udało się zaktualizować użytkownika.");
                }

                return Ok();
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Wystąpił błąd podczas aktualizacji użytkownika.");
                return StatusCode(500, "Wystąpił błąd podczas aktualizacji użytkownika.");
            }
        }
    }
}