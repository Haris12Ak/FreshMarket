FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 7245  

ENV ASPNETCORE_URLS=http://+:7245

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .

FROM build AS publish
RUN dotnet publish "Fresh/Fresh.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
COPY wait-for-it.sh .
ENTRYPOINT ["dotnet", "Fresh.dll"]