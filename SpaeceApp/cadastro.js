async function salvarQuestao(event) {
    event.preventDefault(); // Impede a página de recarregar ao enviar o formulário

    // Coleta as alternativas digitadas e monta uma lista (Array) igual o C# espera
    const listaAlternativas = [
        document.getElementById('alt0').value,
        document.getElementById('alt1').value,
        document.getElementById('alt2').value,
        document.getElementById('alt3').value
    ];

    // Monta o objeto da questão no exato formato que a classe Questao do C# possui
    const dadosQuestao = {
        descritor: document.getElementById('descritor').value,
        enunciado: document.getElementById('enunciado').value,
        imagemUrl: document.getElementById('imagemUrl').value,
        alternativas: listaAlternativas,
        alternativaCorreta: parseInt(document.getElementById('alternativaCorreta').value),
        explicacao: document.getElementById('explicacao').value,
        ano: document.getElementById('ano').value,
        materia: document.getElementById('materia').value
    };

    try {
        // Envia os dados para a API do C# usando o método POST
        const resposta = await fetch('https://ftempurl.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosQuestao) // Transforma o objeto JS em texto JSON
        });

        const resultado = await resposta.json();

        if (resposta.ok) {
            alert("Sucesso: " + resultado.mensagem);
            document.getElementById('form-cadastro').reset(); // Limpa o formulário para a próxima questão
        } else {
            alert("Erro ao cadastrar: " + resultado);
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor C#.");
        console.error(erro);
    }
}