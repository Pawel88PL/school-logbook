using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.Identity;

namespace backend.Interfaces
{
    public interface IUserService
    {
        Task<IdentityResult> AddNewUserAsync(AddUserModel addUserModel);
        Task<IdentityResult> DeleteUserAsync(string userId);
        Task<SimpleUserDto?> GetUserByIdAsync(string id);
        Task<PagedUsers> GetUsersPaged(PagedRequest request);
        Task<bool> UpdateUserAsync(UpdateUser updateUser);
    }
}