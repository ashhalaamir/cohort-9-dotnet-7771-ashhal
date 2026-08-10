using System.Net;
using System.Text.Json;

namespace TaskManagement.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _env;

        public ExceptionMiddleware(
            RequestDelegate next,
            ILogger<ExceptionMiddleware> logger,
            IWebHostEnvironment env)
        {
            // 🔥 FIXED: Validate all injected dependencies
            ArgumentNullException.ThrowIfNull(next);
            ArgumentNullException.ThrowIfNull(logger);
            ArgumentNullException.ThrowIfNull(env);

            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred");
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            // 🔥 FIXED: Use fixed public messages in production
            var (statusCode, message) = MapException(exception);

            var response = new ErrorResponse
            {
                StatusCode = statusCode,
                Message = _env.IsDevelopment() 
                    ? message  // ✅ Development: Show full exception message
                    : GetPublicMessage(statusCode), // ✅ Production: Use fixed messages
                Timestamp = DateTime.UtcNow
            };

            context.Response.StatusCode = response.StatusCode;

            var jsonOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(response, jsonOptions);
            await context.Response.WriteAsync(json);
        }

        // ============================================================
        // 🔥 NEW: Separate mapping logic for status codes and messages
        // ============================================================
        private (int statusCode, string message) MapException(Exception exception)
        {
            return exception switch
            {
                ArgumentNullException => ((int)HttpStatusCode.BadRequest, exception.Message),
                ArgumentException => ((int)HttpStatusCode.BadRequest, exception.Message),
                UnauthorizedAccessException => ((int)HttpStatusCode.Unauthorized, "You are not authorized to perform this action."),
                KeyNotFoundException => ((int)HttpStatusCode.NotFound, exception.Message),
                InvalidOperationException => ((int)HttpStatusCode.BadRequest, exception.Message),
                System.ComponentModel.DataAnnotations.ValidationException => ((int)HttpStatusCode.BadRequest, exception.Message),
                _ => ((int)HttpStatusCode.InternalServerError, "An error occurred while processing your request.")
            };
        }

        // ============================================================
        // 🔥 NEW: Fixed public messages for production
        // ============================================================
        private static string GetPublicMessage(int statusCode)
        {
            return statusCode switch
            {
                400 => "The request could not be processed due to invalid input.",
                401 => "You are not authorized to perform this action.",
                403 => "You do not have permission to access this resource.",
                404 => "The requested resource could not be found.",
                409 => "The request conflicts with the current state of the resource.",
                422 => "The request could not be processed due to validation errors.",
                _ => "An error occurred while processing your request."
            };
        }
    }

    public class ErrorResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string? Details { get; set; }
    }
}