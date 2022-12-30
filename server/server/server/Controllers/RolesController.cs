using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using server.Data;
using server.Models;
using server.Requests;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController :ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public RolesController(ApplicationDbContext context)
        {
            _context= context;
        }

        //Get All Roles 
        [HttpGet]

        public async Task<ActionResult<IEnumerable<Role>>> GetAll() 
        {
            try
            {
                if (_context.roles == null)
                {
                    return NotFound();
                }

                List<Role> roles = await _context.roles.AsNoTracking().ToListAsync();           

                return roles;
            }
            catch (Exception ex) 
            {
                return BadRequest(ex.Message);
            }
      
        }

        //get role by id
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetById(int id) 
        {

            try
            {
                if(_context.roles == null)
                {
                    return NotFound();
                }

                var role = await _context.roles.FindAsync(id);

                if(role == null )
                {
                    return NotFound($"No Role With This ID {id}");
                }
                
                return Ok(role);
            }
            catch (Exception ex) 
            { 
                return BadRequest(ex.Message);
            }

            
        }
        //add Role 
        [HttpPost]
        public async Task<ActionResult<Role>> AddRole(AddRoleRequest  role)
        {
            try
            {

                if (_context.roles == null)
                {
                    return BadRequest();
                } 
                else if (role.Name == "")
                {
                    return BadRequest("Role Name Cannot Be Empty");
                }
                else if (role.Name == null)
                {
                    return BadRequest("Name Is Required");
                }
                else if (CheckUniqueName(role.Name))
                {
                    return BadRequest("Name Is Already Taken");
                }


                var newRole = new Role { Name= role.Name.ToLower() };

                _context.roles.Add(newRole);

                await _context.SaveChangesAsync();

                return CreatedAtAction("GetById",new {id = newRole.Id}, newRole);

            }
            catch (Exception ex)
            {
                return BadRequest( ex.Message);
            }

        }

        //update role
        [HttpPut("{id}")]
        public async Task<ActionResult<Role>> UpdateRole (int id, UpdateRoleRequest req)
        {

            try
            {
                if(_context.roles == null)
                {
                    return BadRequest();
                } 

                var role = await _context.roles.FindAsync(id);

                if(role == null)
                {
                    return NotFound("id not found");
                }
                else if (req.Name == "")
                {
                    return BadRequest("Role Name Cannot Be Empty");
                }
                else if (req.Name == null)
                {
                    return BadRequest("Name Is Required");
                }
                else if(CheckUniqueName(req.Name))
                {
                    return BadRequest("Name Is Already Taken");
                }

                role.Name = req.Name.ToLower();
                await _context.SaveChangesAsync();

                return Ok(role);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //remove role 
        [HttpDelete("{id}")]
        public async Task<ActionResult<Role>> RemoveRole (int id)
        {
            try
            {
                if (_context.roles == null)
                {
                    return BadRequest();
                }
                var role = await _context.roles.FindAsync(id);

                if (role == null)
                {
                    return NotFound("Id not found");
                }

                _context.roles.Remove(role);
                await _context.SaveChangesAsync();

                return Ok(role);

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        private bool CheckUniqueName  (string roleName)
        {
            bool result = _context.roles.Any(r => r.Name.ToLower() == roleName.ToLower());
                return result;
        }
    }
}
