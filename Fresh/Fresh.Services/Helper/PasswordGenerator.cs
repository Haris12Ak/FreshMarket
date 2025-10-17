using System.Text;

namespace Fresh.Services.Helper
{
    public static class PasswordGenerator
    {
        public static string GeneratePassword(int length = 12)
        {
            if (length < 8)
                throw new Exception("Password length must be at least 8 characters.");

            const string lower = "abcdefghijklmnopqrstuvwxyz";
            const string upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string digits = "0123456789";
            const string special = "!@$?_-";

            var random = new Random();
            var password = new StringBuilder();

            password.Append(lower[random.Next(lower.Length)]);
            password.Append(upper[random.Next(upper.Length)]);
            password.Append(digits[random.Next(digits.Length)]);
            password.Append(special[random.Next(special.Length)]);

            string allChars = lower + upper + digits + special;

            for (int i = password.Length; i < length; i++)
            {
                password.Append(allChars[random.Next(allChars.Length)]);
            }

            return new string(password.ToString().OrderBy(x => random.Next()).ToArray());
        }
    }
}
