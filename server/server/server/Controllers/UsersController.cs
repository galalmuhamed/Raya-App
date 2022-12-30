using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using BCrypt.Net;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Any;
using server.Data;
using server.Models;
using server.Requests;
using server.Response;

namespace server.Controllers
{
    //to append token to user class

    public class UserResponseWithToken : UserResponse
    {
        public string? Token { get; set; }
    }


    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configruation;

        public UsersController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configruation = configuration;
        }

        //get all users
        [HttpGet]
       public async Task<ActionResult< IEnumerable<UserResponse>>> GetAllUser() 
        {

            try
            {
                if(_context.users == null) 
                {
                    return NotFound(); 
                }

                return await _context.users.Join(
                        _context.roles,
                        user => user.RoleId,
                        role => role.Id,
                        (user, role) => new UserResponse
                        {
                            Id = user.Id,
                            Username= user.Username,
                            CreatedDate =user.CreatedDate,
                            RoleName= role.Name,
                        }
                        ).ToListAsync();

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
           
        }
        // get user by id
        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetById (int id)
        {
            try
            {
                if(_context.users == null)
                {
                    return NotFound();
                }

                var user = await _context.users
                    .Join(
                    _context.roles,
                    user => user.RoleId,
                    role => role.Id,
                    (user, role) => new
                    {
                        id = user.Id,
                        user.Username,
                        user.CreatedDate,
                        Rolename = role.Name
                    }
                    ).SingleOrDefaultAsync(u => u.id == id);

                if (user == null)
                {
                    return NotFound( $"No User With this Id {id}");
                }

                return Ok(user);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        //add user
        [HttpPost]
        public async Task<ActionResult<UserResponseWithToken>> AddUser(AddUserRequest user)
        {
            try
            {
                if (_context.users == null)
                {
                    return NotFound();
                }
                else if (user.Username == null || user.Username == "")
                {
                    return BadRequest("Username Is Required");
                }
                else if (user.RoleId == 0)
                {
                    return BadRequest("Role Is Required");
                }
                else if (user.Password == null || user.Password == "")
                {
                    return BadRequest("Password Is Required");
                }
                else if(CheckUniqueUser(user.Username))
                {
                    return NotFound($"This Name {user.Username} is Already Taken");
                } 
              
                else if(!CheckRoleIdIfExist(user.RoleId))
                {
                    return BadRequest($"There Is no role with this id {user.RoleId}");
                }
              
              

                //hash password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(user.Password);

                //create new user
                var newUser= new User {  Username = user.Username, Password= hashedPassword, RoleId=user.RoleId};

           
                //save User to db
                _context.users.Add(newUser);
                await _context.SaveChangesAsync();

                //getRole Name
                var Role = await _context.roles.FindAsync(newUser.RoleId);


                //user response 
                var userRespponse = new UserResponse
                {
                    Id = newUser.Id,
                    Username = newUser.Username,
                    CreatedDate = newUser.CreatedDate,
                    RoleName = Role.Name,
                };


                //create Token
                var token = GenerateToken(userRespponse);

               
                //response 
                var respponse = new UserResponseWithToken 
                { 
                    Id = newUser.Id, 
                    Username = newUser.Username, 
                    CreatedDate= newUser.CreatedDate , 
                    RoleName = Role.Name, 
                    Token = token 
                };

                return Ok(respponse);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            } 

        }


        //login
        [HttpPost("signIn")]
        public async Task<ActionResult<UserResponseWithToken>> SignIn (SignInUserRequest req)
        {
            try
            {
                if(req.Username == null || req.Username == "")
                {
                    return BadRequest("Username Is required");
                }
                else if(req.Password== null || req.Password == "")
                {
                    return BadRequest("Password Is Required");
                }

                var user = await _context.users.SingleOrDefaultAsync(m => m.Username == req.Username);

                if(user == null)
                { 
                    return NotFound("No UserName Found"); 
                }

                bool verified = BCrypt.Net.BCrypt.Verify(req.Password, user.Password);

                if(!verified)
                {
                    return BadRequest("Password Is Incorrect");
                }

                //get role name
                var Role = await _context.roles.FindAsync(user.RoleId);

                //user rsponse to send to token
                var userRespponse = new UserResponse
                {
                    Id = user.Id,
                    Username = user.Username,
                    CreatedDate = user.CreatedDate,
                    RoleName = Role.Name,
                };


                // generate token
                var token = GenerateToken(userRespponse);

                //new response with token to send to client
                var respponse = new UserResponseWithToken
                {
                    Id = userRespponse.Id,
                    Username = userRespponse.Username,
                    CreatedDate = userRespponse.CreatedDate,
                    RoleName = userRespponse.RoleName,
                    Token = token
                };

                return Ok(respponse);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<UserResponse>> UpdateUser (int id, UpdateUserRequest req)
        {
            try
            {
                //get user
                var user = await _context.users.FindAsync(id);

                if (user == null)
                {
                    return NotFound("User Not Found");
                }

                else if (req.Username != user.Username && CheckUniqueUser(req.Username))
                {
                    return NotFound($"This Name {req.Username} is Already Taken");
                }
                else if (!CheckRoleIdIfExist(req.RoleId))
                {
                    return BadRequest($"There Is no role with this id {req.RoleId}");
                }
                
                user.Username = user.Username != req.Username ? req.Username : user.Username;
                user.RoleId = user.RoleId !=  req.RoleId ? req.RoleId : user.RoleId;
                await _context.SaveChangesAsync();
                //get role
                var Role = await _context.roles.FindAsync(user.RoleId);
                if(Role== null)
                {
                    return BadRequest("there is no role ");
                }

                var response = new UserResponse { Id=user.Id ,Username=user.Username, CreatedDate=user.CreatedDate, RoleName=Role.Name};

                return response;

            }
            catch(Exception ex) 
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpPut("password")]
        public async Task<ActionResult<User>> ChangePassword  ( UpdateUserPasswordRequest req)
        {
            try
            {
                var user = await _context.users.SingleOrDefaultAsync(m => m.Username == req.Username);

                if (user == null)
                {
                    return NotFound("No UserName Found");
                }

                bool verified = BCrypt.Net.BCrypt.Verify(req.OldPassword, user.Password);

                if (!verified)
                {
                    return BadRequest("Your Old Password Is Incorrect");
                }


                //New hash password
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);

                user.Password = hashedPassword;
                await _context.SaveChangesAsync();

                return user;


            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }


        [HttpDelete("{id}")]
        public async Task<ActionResult<User>> DeleteUser(int id)
        {
            try
            {
                if(_context.users == null) 
                { 
                    return NotFound(); 
                }

                var user = await _context.users.FindAsync(id);

                if (user == null)
                { 
                    return NotFound("User Not Found");
                }

                _context.users.Remove(user);
                await _context.SaveChangesAsync();

                return user;

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //check if Role Id is there
        private bool CheckRoleIdIfExist(int roleId)
        {
            bool result = _context.roles.Any(r => r.Id == roleId);
            return result;
        }
        // check if username is unique
        private bool CheckUniqueUser(string username)
        {
            bool result = _context.users.Any(m => m.Username.ToLower() == username.ToLower());
            return result;
        }
        //generate token
        private string GenerateToken(UserResponse user)
        {

            //calims
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.PrimarySid, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.RoleName),
                new Claim(ClaimTypes.DateOfBirth, user.CreatedDate.ToString())
            };

            //token
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                    _configruation.GetSection("AppSettings:Token").Value));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: cred
                );
            var actualToken = new JwtSecurityTokenHandler().WriteToken(token);


            return actualToken;
        }


    }
}
/*
    public async Task<ActionResult< IEnumerable<User>>> GetAllUser([FromQuery] string? sort) 
        {
            if(_context.Users == null) 
                {
                    return NotFound(); 
                }

            var users = from s in _context.Users
                           select s;

            switch (sort)
            {
                case "nameAsc":
                     users = users.OrderBy(u => u.UserName);
                    break;
                case "nameDsc":
                      users =  users.OrderByDescending(u => u.UserName);
                    break;
                default:
                    users = users;
                    break;
            }

            return await users.ToListAsync();
           

        }



       
 
 */