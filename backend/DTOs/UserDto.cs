namespace backend.DTOs;

public class AddUserModel
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string Password { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
    public bool IsActive { get; set; }
}

public class Login
{
    public required string UserName { get; set; }
    public required string Password { get; set; }
}

public class PagedUsers
{
    public int TotalRecords { get; set; }
    public List<UserDto> Data { get; set; } = new List<UserDto>();
}

public class SimpleUserDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
}

public class UpdateUser
{
    public string? Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public string? NewPassword { get; set; }
    public string? Role { get; set; }
    public bool IsActive { get; set; }
}

public class UserDto
{
    public string? Id { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Email { get; set; }
    public DateTime? DateAdded { get; set; }
    public DateTime? LastSuccessfulLogin { get; set; }
    public string? Role { get; set; }
    public bool IsActive { get; set; }
}