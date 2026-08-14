using System.ComponentModel.DataAnnotations;

namespace TaskManagement.API.Validation
{
    [AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
    public sealed class NotInPastAttribute : ValidationAttribute
    {
        public NotInPastAttribute()
            : base("The date cannot be in the past.")
        {
        }

        public override bool IsValid(object? value)
        {
            if (value == null)
                return true;

            if (value is DateTime date)
                return date.Date >= DateTime.UtcNow.Date;

            return false;
        }
    }
}
