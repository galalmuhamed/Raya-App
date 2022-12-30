using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.OpenApi.Any;
using server.Data;
using server.Models;
using server.Requests;
using System;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    
    public class AgentController: ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AgentController(ApplicationDbContext context) 
        {
            _context = context;
        }

        //Get All agents
        [HttpGet]
        public async Task<ActionResult<List<Agent>>> GetAll(string? sort)
        {
            try
            {

                var agents = from s in _context.agents
                            select s;

                switch (sort)
                {
                    case "0":
                    case "new":
                        agents = agents.OrderByDescending(u => u.status);
                        break;
                    case "1":
                    case "approved":
                        agents = agents.OrderBy(u => u.status );
                        break;
                    case "oldestDates":
                        agents = agents.OrderBy(u => u.CreatedAt);
                        break;
                    case "newestDates":
                        agents = agents.OrderByDescending(u => u.CreatedAt);
                        break;
                    case "filterOnlyNewWithNewestDate":
                        agents = agents.Where(u => u.status==AgentStatusEnum.New).OrderByDescending(u => u.CreatedAt);
                        break;
                    case "filterOnlyApprovedWithNewestDate":
                        agents = agents.Where(u => u.status == AgentStatusEnum.Approved).OrderByDescending(u => u.CreatedAt);
                        break;
                    default:
                        agents = agents;
                        break;
                }
                

                return await agents.ToListAsync();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // Get Agent By Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Agent>> GetById (int id)
        {
            try
            {
                if(_context.agents == null) 
                {
                    return NotFound();
                }

                var agent = await _context.agents.FindAsync(id);

                if(agent == null)
                {
                    return NotFound($"No Agent With Id {id}");
                }

                return Ok(agent);


            }
            catch (Exception ex) 
            { 
                return BadRequest(ex.Message);  
            }
        }

        //Add New Agent 
        [HttpPost] 
        public async Task<ActionResult<Agent>> AddAgent(AddAgentRequest req)
        {
            try
            {
                if(_context.agents == null) 
                { 
                    return NotFound();
                }
                else if (req.Name == null || req.Name == "") 
                {
                    return BadRequest("Name Is Required");
                } 
                else if (req.status == null)
                {
                    return BadRequest("Status Is Required");
                }
                else if (req.UserId == 0)
                {
                    return BadRequest("User Id Is Required");
                }

                //get user Who making request to check role value
                var user = await _context.users
                                    .Join(
                                       _context.roles,
                                       u => u.RoleId,
                                       r => r.Id,
                                       (User, Role) => new
                                       {
                                           User.Id,
                                           User.Username,
                                           User.CreatedDate,
                                           RoleName = Role.Name
                                       })
                                    .SingleOrDefaultAsync(u => u.Id == req.UserId);

                if (user == null)
                {
                    return BadRequest($"No User With this Id {req.UserId}");
                }

                Agent newA = new Agent();

                if (user.RoleName == "admin")
                {
                    newA.Name = req.Name.ToLower();

                    switch (req.status.ToLower())
                    {
                        case "0":
                        case "new":
                            newA.status = AgentStatusEnum.New;
                            break;
                        case "1":
                        case "approved":
                            newA.status = AgentStatusEnum.Approved;
                            break;
                        default:
                            return BadRequest("Staus must Be New Or Approved");
                    }

                }
                else
                {
                    newA.Name = req.Name.ToLower();
                    newA.status = AgentStatusEnum.New;
                }

                 _context.agents.Add(newA);   

                await _context.SaveChangesAsync();

                return Ok(newA);
                
            }
            catch (Exception ex) 
            { 
                return BadRequest(ex.Message);
            }
        }


        //Change Agent Information
        [HttpPut("{id}")]      
        public async Task<ActionResult<Agent>> UpdateAgent( int id, UpdateAgentRequest req)
        {
            try
            {
                if (_context.agents == null)
                {
                    return NotFound();
                } 

                var agent = await _context.agents.SingleOrDefaultAsync(a => a.Id == id);

                if (agent == null)
                {
                    return NotFound("Agent Not Found");
                }
                else if (req.Name == null)
                {
                    return NotFound("Name Is Required");
                }
                else if (req.Name != agent.Name && req.Name == "")
                {
                    return BadRequest("Name Cannot Be Empty");
                }
                else if (req.status == null)
                {
                    return BadRequest("Status Is Required");
                }
                else if (req.UserId == 0)
                {
                    return BadRequest("User Id Is Required");
                }

                var user = await _context.users
                                    .Join(
                                       _context.roles,
                                       u => u.RoleId,
                                       r => r.Id,
                                       (User,Role) => new
                                        {
                                            User.Id,
                                            User.Username,
                                            User.CreatedDate,
                                            RoleName = Role.Name
                                        })
                                    .SingleOrDefaultAsync(u => u.Id == req.UserId);

                if (user == null)
                {
                    return BadRequest($"No User With this Id {req.UserId}");
                }

                if (agent.status == AgentStatusEnum.Approved && user.RoleName != "admin")
                {

                }

                if (user.RoleName == "admin")
                {
                    agent.Name = req.Name.ToLower();

                    switch (req.status.ToLower())
                    {
                        case "0":
                        case "new":
                            agent.status = AgentStatusEnum.New;
                            break;
                        case "1":
                        case "approved":
                            agent.status = AgentStatusEnum.Approved;
                            break;
                        default:
                            return BadRequest("Staus must Be New Or Approved");
                    }

                } 
                //if im not admin and agent status equal to approved so member user cant change data

                else if (user.RoleName != "admin" && agent.status == AgentStatusEnum.Approved) 
                { 
                    agent.Name = agent.Name;
                    agent.status = agent.status;
                
                } else
                {
                    agent.Name = req.Name;
                    agent.status = agent.status;
                }
            


                await _context.SaveChangesAsync();

                return Ok(agent);



            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
       
        }
        //Delete Agent 
        [HttpDelete("{id}")]
        public async Task<ActionResult<Agent>> DeleteAgent(int id) 
        {
            try
            {
                if(_context.agents == null)
                {
                    return NotFound();
                }
                var agent = await _context.agents.FindAsync(id);
                if(agent == null)
                {
                    return NotFound("No Id Found");
                }
                _context.agents.Remove(agent);
                await _context.SaveChangesAsync();
                return Ok(agent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message); 
            }

        } 


       
    }
}
