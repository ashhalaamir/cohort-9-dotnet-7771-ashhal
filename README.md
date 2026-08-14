# cohort-9-dotnet-7771-ashhal
Cohort 9 — .NET Fullstack (.NET+ReactJS) assignment for Ashhal Aamir

## Backend JWT Secret Configuration

The API requires a runtime JWT signing key and does not commit a production secret to source control.

- The API project already has a `UserSecretsId` configured, so you can set development secrets without modifying checked-in files.

- In development, set the key with `dotnet user-secrets`:
  ```powershell
  cd backend/TaskManagement.API
  dotnet user-secrets set "Jwt:Key" "<your-strong-secret>"
  ```
  - The JWT signing key must be at least 32 characters long and should be generated from a secure random source.

- Alternatively, set an environment variable before starting the API:
  - Windows PowerShell:
    ```powershell
    $env:Jwt__Key = "<your-strong-secret>"
    dotnet run --project backend/TaskManagement.API/TaskManagement.API.csproj
    ```
  - Linux/macOS:
    ```bash
    export Jwt__Key="<your-strong-secret>"
    dotnet run --project backend/TaskManagement.API/TaskManagement.API.csproj
    ```

- In production, configure the secret in your deployment environment (App Service, Kubernetes secret, AWS Parameter Store, etc.) as `Jwt:Key` or `Jwt__Key`.

Do not commit a real signing key to source control. The application will fail startup if `Jwt:Key` is missing or empty.
