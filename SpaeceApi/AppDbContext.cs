using Microsoft.EntityFrameworkCore;

namespace SpaeceApi;

public class AppDbContext : DbContext
{
    public DbSet<Questao> Questoes { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Define o nome do arquivo do banco como spaece.db
        optionsBuilder.UseSqlite("Data Source=spaece.db");
    }
}