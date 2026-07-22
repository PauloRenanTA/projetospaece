FROM ://microsoft.com AS build
WORKDIR /app

# Copia os arquivos e restaura as dependências
COPY . .
RUN dotnet restore "SpaeceApi.csproj"

# Compila o projeto em modo Release
RUN dotnet publish "SpaeceApi.csproj" -c Release -o /out

# Cria a imagem final de execução
FROM ://microsoft.com
WORKDIR /app
COPY --from=build /out .

# Expõe a porta e define o ponto de entrada do sistema
EXPOSE 5020
ENTRYPOINT ["dotnet", "SpaeceApi.dll"]
