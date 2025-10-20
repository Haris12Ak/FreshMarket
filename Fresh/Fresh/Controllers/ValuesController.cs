using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Fresh.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        [HttpGet]
        [Authorize(Roles = "admin")]
        [Route("get-admin")]

        public IActionResult GetAdmin()
        {
            return Ok("You are admin.");
        }

        [HttpGet]
        [Authorize(Roles = "client")]
        [Route("get-client")]
        public IActionResult GetClient()
        {
            return Ok("You are client.");
        }
    }
}
