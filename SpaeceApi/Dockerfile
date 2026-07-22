FROM ://microsoft.com AS build
WORKDIR /src
COPY ["SpaeceApi.csproj", "./"]
RUN dotnet restore "./SpaeceApi.csproj"
COPY . .
RUN dotnet build "SpaeceApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SpaeceApi.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM ://microsoft.com AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SpaeceApi.dll"]
