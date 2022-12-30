## insallation

1. setup database
   - open appsettings.json
   ```
    {
        "AppSettings": {
            "Token": "any secret token from your choice"
        },
        "Logging": {
            "LogLevel": {
            "Default": "Information",
            "Microsoft.AspNetCore": "Warning"
            }
        },
        "AllowedHosts": "*",
        "ConnectionStrings": {
            "ConnectToDb":
                "Server={Your SQL Server Name};Database=raya;Trusted_Connection=true;TrustServerCertificate=Yes",
            "ConnectToFrontend": "http://localhost:3000"
        }
    }
   ```
   2. install dependencies
   3. start your back-end

## Models

```
User Model

   public class User
    {
        public int Id { get; set; }

        [Required,MaxLength(50)]
        public string? Username { get; set; }

        [Required]
        public string? Password { get; set; }

        public DateTime? CreatedDate { get; set; } = DateTime.Now;

        [Required]
        public int RoleId { get; set; }

        public Role? Role { get; set; }
    }

Role Model

  public class Role
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        public List<User>? Users { get; set; }
    }

Agent Model

   public class Agent
    {
        public int Id { get; set; }

        [Required]
        public string? Name { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public AgentStatusEnum status { get; set; }
    }

```

## APi Routes

### Role Route

```
[Get All Roles][Get] https://localhost:5000/api/Roles
[Get Role By Id][Get] https://localhost:5000/api/Roles/{id}
[Delete Role][DELETE] https://localhost:5000/api/Roles/{id}
[Add Role][POST] http://localhost:5000/api/Roles
    {
        "name":"Iphone 13",
    }
[Update Role][PUT] http://localhost:5000/api/Roles/{id}
    {
        "name":"iphone 14",
    }
```

### User Route

```
[Get All Users][Get] https://localhost:5000/api/Users
[Get User By Id][Get] https://localhost:5000/api/Users/{id}
[Delete User][DELETE] https://localhost:5000/api/Users/{id}
[Add User And Register][POST] http://localhost:5000/api/Users
    {
        "username": "galal",
        "password": "12",
        "roleId": 1
    }
[Update User][PUT] http://localhost:5000/api/Users/{id}
    {
        "username": "galal",
        "roleId": 2
    }
[Update User Password][PUT] http://localhost:5000/api/Users/password
    {
        "username": "galal",
        "oldPassword": "12",
        "newPassword": "123"
    }
[SIGN IN][POST] http://localhost:5000/api/Users/signIn
    {
        "username": "galal",
        "password": "12",
    }
```

### Agent Route

```
[Token Require] All Routes
[Get All Agents][Get] https://localhost:5000/api/Agent we can provide query ?sort=new
[Get Agent By Id][Get] https://localhost:5000/api/Agent/{id}
[Delete Agent][DELETE] https://localhost:5000/api/Agent/{id}
[Add Agent][POST] http://localhost:5000/api/Agent
    {
        "name": "ahmed mohamed",
        "status": "1",
        "userId": 1
    }
[Update Role][PUT] http://localhost:5000/api/Agent/{id}
    {
        "name": "ahmed mohamed",
        "status": "0",
        "userId": 1
    }
```
