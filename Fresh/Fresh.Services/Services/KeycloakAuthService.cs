using Fresh.Model;
using Fresh.Model.Requests;
using Microsoft.Extensions.Configuration;
using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Fresh.Services.Services
{
    public class KeycloakAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private string _accessToken;

        public KeycloakAuthService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }

        public async Task<TokenResponse> LoginAsync(string username, string password)
        {
            var tokenEndpoint = $"{_configuration["Keycloak:BaseUrl"]}/realms/{_configuration["Keycloak:Realm"]}/protocol/openid-connect/token";

            var requestBody = new Dictionary<string, string>
        {
            { "grant_type", "password" },
            { "client_id", _configuration["Keycloak:ClientId"] },
            { "client_secret", _configuration["Keycloak:ClientSecret"] },
            { "username", username },
            { "password", password }
        };

            var content = new FormUrlEncodedContent(requestBody);

            var response = await _httpClient.PostAsync(tokenEndpoint, content);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var tokenResult = JsonSerializer.Deserialize<TokenResponse>(responseContent);

                return tokenResult!;
            }

            throw new Exception("failed");
        }

        public async Task AuthenticateAdminAsync()
        {
            var tokenEndpoint = $"{_configuration["Keycloak:BaseUrl"]}/realms/master/protocol/openid-connect/token";

            var requestBody = new Dictionary<string, string>
        {
            { "grant_type", "password" },
            { "client_id", _configuration["Keycloak:AdminClientId"]! },
            { "username", _configuration["Keycloak:AdminUser"]! },
            { "password", _configuration["Keycloak:AdminPassword"]! }
        };

            var content = new FormUrlEncodedContent(requestBody);

            var response = await _httpClient.PostAsync(tokenEndpoint, content);

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();

                using var jsonDoc = JsonDocument.Parse(responseContent);
                var root = jsonDoc.RootElement;

                _accessToken = root.GetProperty("access_token").GetString()!;
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);
            }
            else
                throw new Exception("failed");
        }

        public async Task<string> CreateUserAsync(UserDto user, bool forcePasswordUpdated)
        {
            var userPayload = new
            {
                username = user.Username,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                enabled = true,
                credentials = new[]
                {
                    new
                    {
                        type = "password",
                        value = user.Password,
                        temporary = forcePasswordUpdated
                    }
                },
                requiredActions = forcePasswordUpdated ? new[] { "UPDATE_PASSWORD" } : Array.Empty<string>(),
            };

            var url = $"{_configuration["Keycloak:BaseUrl"]}/admin/realms/{_configuration["Keycloak:Realm"]}/users";

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(userPayload, options);
            Console.WriteLine(json);

            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(url, content);

            response.EnsureSuccessStatusCode();

            if (response.StatusCode == HttpStatusCode.Conflict)
            {
                throw new Exception("User already exists (409 Conflict).");
            }

            if (!response.IsSuccessStatusCode)
            {
                var responseText = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to create user. Status: {response.StatusCode}. Response: {responseText}");
            }

            var location = response.Headers.Location!.ToString();
            var id = location.Split('/').Last(); // KeycloakId
            return id;
        }

        public async Task AssignRoleAsync(string userId, string roleName)
        {
            var realm = _configuration["Keycloak:Realm"];
            var baseUrl = _configuration["Keycloak:BaseUrl"];

            var roleUrl = $"{baseUrl}/admin/realms/{realm}/roles/{roleName}";
            var roleResp = await _httpClient.GetAsync(roleUrl);
            roleResp.EnsureSuccessStatusCode();

            var roleJson = await roleResp.Content.ReadAsStringAsync();
            var roleObj = JsonSerializer.Deserialize<JsonElement>(roleJson);

            var roleRep = new[]
            {
                new
                {
                    id = roleObj.GetProperty("id").GetString(),
                    name = roleObj.GetProperty("name").GetString()
                }
            };

            var assignUrl = $"{baseUrl}/admin/realms/{realm}/users/{userId}/role-mappings/realm";

            var json = JsonSerializer.Serialize(roleRep);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var assignResp = await _httpClient.PostAsync(assignUrl, content);
            assignResp.EnsureSuccessStatusCode();
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var realm = _configuration["Keycloak:Realm"];
            var baseUrl = _configuration["Keycloak:BaseUrl"];

            var client = new HttpClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _accessToken);

            var response = await client.DeleteAsync($"{baseUrl}/admin/realms/{realm}/users/{userId}");
            return response.IsSuccessStatusCode;
        }
    }
}
