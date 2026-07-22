let questoes = [];
let indiceAtual = 0;
let acertos = 0; //Contabiliza os acertos do aluno

// Função chamada quando o aluno clica em um botão do Menu
async function iniciarSimulado(ano, materia) {
    try {
        acertos = 0;
        const resposta = await fetch(`https://ftempurl.com{ano}&materia=${materia}`);
        
        if (!resposta.ok) {
            throw new Error(`Erro no servidor C#: Status ${resposta.status}`);
        }
        
        questoes = await resposta.json();
        indiceAtual = 0; // Reseta o contador de questões

        // Alterna as telas: esconde o menu e mostra o simulado
        document.getElementById('tela-menu').classList.add('hidden');
        document.getElementById('tela-simulado').classList.remove('hidden');
        
        mostrarQuestao();
    } catch (erro) {
        alert("Erro ao conectar com o servidor do app.");
        console.error(erro);
    }
}

function mostrarQuestao() {
    try {
        if (questoes.length === 0) {
            document.getElementById('enunciado').innerHTML = "<span style='color:orange;'>Nenhuma questão encontrada para este filtro no banco de dados.</span>";
            document.getElementById('alternativas').innerHTML = '';
            return;
        }
        
        const q = questoes[indiceAtual];
        
        document.getElementById('descritor-tag').innerText = `Descritor: ${q.descritor || 'Sem Descritor'}`;
        document.getElementById('enunciado').innerText = q.enunciado || 'Sem Enunciado';
        
        // Lógica da Imagem
        const imgElement = document.getElementById('questao-imagem');
        if (q.imagemUrl && typeof q.imagemUrl === 'string' && q.imagemUrl.trim() !== "") {
            imgElement.src = q.imagemUrl;
            imgElement.classList.remove('hidden');
        } else {
            imgElement.src = "";
            imgElement.classList.add('hidden');
        }
        
        // Lógica das Alternativas
        const container = document.getElementById('alternativas');
        container.innerHTML = ''; 
        document.getElementById('feedback').classList.add('hidden');

        const letras = ["A)", "B)", "C)", "D)"];

        q.alternativas.forEach((alternativa, index) => {
            const btn = document.createElement('button');
            btn.classList.add('option-btn');
            
            // Juntar a letra automática com o texto vindo do banco!
            btn.innerText = `${letras[index]} ${alternativa}`;
            
            btn.onclick = () => verificarResposta(index, q.alternativaCorreta, q.explicacao);
            container.appendChild(btn);
        });

    } catch (erroInterno) {
        document.getElementById('enunciado').innerHTML = `<span style="color:red;">⚠️ Erro de Programação:</span><br>${erroInterno.message}`;
    }
}

function verificarResposta(escolhida, correta, explicacao) {
    const feedbackBox = document.getElementById('feedback');
    const feedbackTexto = document.getElementById('feedback-texto');
    //Aqui fiz algumas mudanças para que os botões fiquem verde ou vermelho de acordo com a resposta escolhida pelo usuário
    // Pega todos os botões de alternativas que estão na tela dentro do container
    const botoes = document.getElementById('alternativas').getElementsByTagName('button');

    // Faz um loop por todos os botões para aplicar as cores e travar os cliques
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].classList.add('disabled'); // Trava o botão para não clicar de novo

        if (i === correta) {
            botoes[i].classList.add('correto'); // O botão certo SEMPRE fica verde
        }
        
        if (i === escolhida && escolhida !== correta) {
            botoes[i].classList.add('incorreto'); // Se errou, o escolhido fica vermelho
        }
    }
    
    // Exibe o texto de feedback pedagógico lá embaixo
    if (escolhida === correta) {
        acertos++;
        feedbackTexto.innerHTML = `<strong>🟢 Você acertou!</strong><br>${explicacao}`;
    } else {
        feedbackTexto.innerHTML = `<strong>🔴 Você errou.</strong><br>${explicacao}`;
    }
    feedbackBox.classList.remove('hidden');
}

function proximaQuestao() {
    indiceAtual++;
    if (indiceAtual < questoes.length) {
        mostrarQuestao();
    } else {
        // FIM. Esconde o simulado e mostra a tela de pontuação
        document.getElementById('tela-simulado').classList.add('hidden');
        document.getElementById('tela-pontuacao').classList.remove('hidden');
        
        // Atualiza o texto do placar
        document.getElementById('placar-texto').innerText = `Você acertou ${acertos} de ${questoes.length} ${questoes.length === 1 ? 'questão' : 'questões'}!`;
    }
}

function voltarParaMenu() {
    // Alterna de volta: esconde o simulado e mostra o menu inicial
    document.getElementById('tela-simulado').classList.add('hidden');
    document.getElementById('tela-menu').classList.remove('hidden');
}

// Aqui para quando o usuário sai da tela de pontuação
function voltarParaMenuDoPlacar() {
    acertos = 0; // Resetar os pontos para o próximo jogo
    document.getElementById('tela-pontuacao').classList.add('hidden');
    document.getElementById('tela-menu').classList.remove('hidden');
}

//Ativa o modo app (PWA)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log("Modo Aplicativo pronto!"))
        .catch(err => console.log("Erro ao ativar Modo Aplicativo:", err));
}