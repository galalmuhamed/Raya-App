namespace server.Requests
{
    public class UpdateUserPasswordRequest
    {
        public string? Username { get; set; }
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
    }
}
 