using SpaeceApi; 
using Microsoft.EntityFrameworkCore; 
using Microsoft.Win32.SafeHandles; 

var builder = WebApplication.CreateBuilder(args); 

// Configuração dinâmica da porta para servidores de nuvem modernos (Render/Railway)
builder.WebHost.ConfigureKestrel(options => 
    options.ListenAnyIP(Environment.GetEnvironmentVariable("PORT") != null 
        ? int.Parse(Environment.GetEnvironmentVariable("PORT")!) 
        : 5020)); 

// Permite que qualquer frontend acesse os dados sem bloqueio de segurança
builder.Services.AddCors(options => { 
    options.AddPolicy("PermitirTudo", policy => { 
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader(); 
    }); 
}); 

var app = builder.Build(); 

app.UseCors("PermitirTudo"); 
app.UseStaticFiles(); 

// --- CONFIGURAÇÃO E ALIMENTAÇÃO DO BANCO DE DADOS --- 
using (var scope = app.Services.CreateScope()) { 
    var db = new AppDbContext(); 
    
    // Cria o banco de dados spaece.db automaticamente se ele não existir 
    db.Database.EnsureCreated(); 
    
    // Se o banco estiver vazio, insere as questões para teste 
    if (!db.Questoes.Any()) { 
        db.Questoes.AddRange( 
            new Questao { 
                Descritor = "D1", 
                Enunciado = "Veja a figura abaixo. Qual é o nome desse animal?", 
                ImagemUrl = "/imagens/gato.jpg",
                Alternativas = new List<string> { "RATO", "PATO", "GATO", "CACHORRO" }, 
                AlternativaCorreta = 2, 
                Explicacao = "A palavra GATO começa com a letra G e termina com TO.", 
                Ano = "2", 
                Materia = "Portugues" 
            }, 
            new Questao { 
                Descritor = "D5", 
                Enunciado = "Maria tinha 5 lápis de col. Ela ganhou mais 4 lápis da sua mãe. Com quantos lápis Maria ficou no total?", 
                Alternativas = new List<string> { "7", "8", "9", "10" }, 
                AlternativaCorreta = 2, 
                Explicacao = "Somando os 5 lápis que ela tinha com os 4 que ganhou: 5 + 4 = 9.", 
                Ano = "2", 
                Materia = "Matematica" 
            }, 
            new Questao { 
                Descritor = "D2", 
                Enunciado = "Qual palavra rima com JANELA?", 
                Alternativas = new List<string> { "PANELA", "BOLO", "SAPATO", "GATO" }, 
                AlternativaCorreta = 0, 
                Explicacao = "JANELA e PANELA terminam com o mesmo som: ELA.", 
                Ano = "2", 
                Materia = "Portugues" 
            }, 
            new Questao { 
                Descritor = "D24 - Matemática", 
                Enunciado = "Um bolo foi dividido em 4 partes iguais. João comeu 1 parte desse bolo. Qual é a fração que representa a parte do bolo que João comeu?", 
                ImagemUrl = "", 
                Alternativas = new List<string> { "1/2", "1/4", "3/4", "4/1" }, 
                AlternativaCorreta = 1, 
                Explicacao = "O bolo foi dividido em 4 partes (denominador) e ele comeu 1 parte (numerador), formando 1/4.", 
                Ano = "5", 
                Materia = "Matematica" 
            }, 
            new Questao { 
                Descritor = "D6 - Português", 
                Enunciado = "Leia o texto abaixo:\n\n'Prezados moradores, informamos que no próximo sábado haverá uma manutenção na rede elétrica do condomínio das 8h às 12h.'\n\nEsse texto pertence a qual gênero textual?", 
                ImagemUrl = "", 
                Alternativas = new List<string> { "Poema", "Conto de fadas", "Aviso", "Receita" }, 
                AlternativaCorreta = 2, 
                Explicacao = "O texto tem o objetivo claro de informar e comunicar os moradores sobre um evento futuro, caracterizando um aviso.", 
                Ano = "5", 
                Materia = "Possui" 
            } 
        ); 
        db.SaveChanges(); 
    } 
} 

// Rota de busca das questões
app.MapGet("/api/questoes", (string? ano, string? materia) => { 
    var db = new AppDbContext(); 
    IQueryable<Questao> consulta = db.Questoes; 
    
    if (!string.IsNullOrEmpty(ano)) { 
        consulta = consulta.Where(q => q.Ano == ano); 
    } 
    if (!string.IsNullOrEmpty(materia)) { 
        consulta = consulta.Where(q => q.Materia == materia); 
    } 
    return Results.Ok(consulta.ToList()); 
}); 

// Rota de cadastro de questões
app.MapPost("/api/questoes", (Questao novaQuestao) => { 
    var db = new AppDbContext(); 
    if (string.IsNullOrEmpty(novaQuestao.Enunciado) || novaQuestao.Alternativas.Count < 4) { 
        return Results.BadRequest("Preencha o enunciado e todas as 4 alternativas."); 
    } 
    db.Questoes.Add(novaQuestao); 
    db.SaveChanges(); 
    return Results.Ok(new { mensagem = "Questão cadastrada com sucesso!", id = novaQuestao.Id }); 
}); 

app.Run(); 

public class Questao { 
    public int Id { get; set; } 
    public string Descritor { get; set; } = string.Empty; 
    public string Enunciado { get; set; } = string.Empty; 
    public string ImagemUrl { get; set; } = string.Empty; 
    public List<string> Alternativas { get; set; } = new List<string>(); 
    public int AlternativaCorreta { get; set; } 
    public string Explicacao { get; set; } = string.Empty; 
    public string Ano { get; set; } = string.Empty; 
    public string Materia { get; set; } = string.Empty; 
}
