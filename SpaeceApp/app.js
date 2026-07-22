// BANCO DE DADOS INTEGRADO DIRETAMENTE NO FRONTEND
let questoes = [
    {
        descritor: "D1",
        enunciado: "Veja a figura abaixo. Qual é o nome desse animal?",
        imagemUrl: "/imagens/gato.jpg",
        alternativas: ["RATO", "PATO", "GATO", "CACHORRO"],
        alternativaCorreta: 2,
        explicacao: "A palavra GATO começa com a letra G e termina com TO.",
        ano: "2",
        materia: "Portugues"
    },
    {
        descritor: "D5",
        enunciado: "Maria tinha 5 lápis de cor. Ela ganhou mais 4 lápis da sua mãe. Com quantos lápis Maria ficou no total?",
        imagemUrl: "",
        alternativas: ["7", "8", "9", "10"],
        alternativaCorreta: 2,
        explicacao: "Somando os 5 lápis que ela tinha com os 4 que ganhou: 5 + 4 = 9.",
        ano: "2",
        materia: "Matematica"
    },
    {
        descritor: "D2",
        enunciado: "Qual palavra rima com JANELA?",
        imagemUrl: "",
        alternativas: ["PANELA", "BOLO", "SAPATO", "GATO"],
        alternativaCorreta: 0,
        explicacao: "JANELA e PANELA terminam com o mesmo som: ELA.",
        ano: "2",
        materia: "Portugues"
    },
    {
        descritor: "D24 - Matemática",
        enunciado: "Um bolo foi dividido em 4 partes iguais. João comeu 1 parte desse bolo. Qual é a fração que representa a parte do bolo que João comeu?",
        imagemUrl: "",
        alternativas: ["1/2", "1/4", "3/4", "4/1"],
        alternativaCorreta: 1,
        explicacao: "O bolo foi dividido em 4 partes (denominador) e ele comeu 1 parte (numerador), formando 1/4.",
        ano: "5",
        materia: "Matematica"
    },
    {
        descritor: "D6 - Português",
        enunciado: "Leia o texto abaixo:\n\n'Prezados moradores, informamos que no próximo sábado haverá uma manutenção na rede elétrica do condomínio das 8h às 12h.'\n\nEsse texto pertence a qual gênero textual?",
        imagemUrl: "",
        alternativas: ["Poema", "Conto de fadas", "Aviso", "Receita"],
        alternativaCorreta: 2,
        explicacao: "O texto tem o objetivo claro de informar e comunicar os moradores sobre um evento futuro, caracterizando um aviso.",
        ano: "5",
        materia: "Portugues"
    }
];

let questoesFiltradas = []; // Guardará as questões após o clique no botão do menu
let indiceAtual = 0;
let acertos = 0; // Contabiliza os acertos do aluno

// Função chamada quando o aluno clica em um botão do Menu
// Função auxiliar para embaralhar uma lista (Algoritmo Fisher-Yates)
function embaralhar(array) {
    let lista = [...array];
    for (let i = lista.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lista[i], lista[j]] = [lista[j], lista[i]];
    }
    return lista;
}

// Função chamada quando o aluno clica em um botão do Menu
function iniciarSimulado(ano, materia) {
    try {
        acertos = 0;
        
        // Filtro inteligente: remove acentos e deixa tudo em letras minúsculas
        const materiaFiltro = materia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        const anoFiltro = String(ano).trim();

        // 1. Filtra as questões que combinam com o botão clicado
        let questoesFiltradasNoFiltro = questoes.filter(q => {
            const qMateria = q.materia ? q.materia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
            const qAno = q.ano ? String(q.ano).trim() : "";
            return qAno === anoFiltro && qMateria === materiaFiltro;
        });

        if (questoesFiltradasNoFiltro.length === 0) {
            questoesFiltradasNoFiltro = questoes; 
        }

        // 2. EMBARALHA as questões encontradas para esta sessão!
        questoesFiltradas = embaralhar(questoesFiltradasNoFiltro);

        indiceAtual = 0; // Reseta o contador de questões para o início

        // Alterna as telas: esconde o menu e mostra o simulado
        document.getElementById('tela-menu').classList.add('hidden');
        document.getElementById('tela-simulado').classList.remove('hidden');
        
        mostrarQuestao();
    } catch (erro) {
        alert("Erro ao iniciar o simulador.");
        console.error(erro);
    }
}

function mostrarQuestao() {
    try {
        if (questoesFiltradas.length === 0) {
            document.getElementById('enunciado').innerHTML = "<span style='color:orange;'>Nenhuma questão encontrada para este filtro no banco de dados.</span>";
            document.getElementById('alternativas').innerHTML = '';
            return;
        }

        const q = questoesFiltradas[indiceAtual];
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
    if (indiceAtual < questoesFiltradas.length) {
        mostrarQuestao();
    } else {
        // FIM. Esconde o simulado e mostra a tela de pontuação
        document.getElementById('tela-simulado').classList.add('hidden');
        document.getElementById('tela-pontuacao').classList.remove('hidden');
        
        // Atualiza o texto do placar
        document.getElementById('placar-texto').innerText = `Você acertou ${acertos} de ${questoesFiltradas.length} ${questoesFiltradas.length === 1 ? 'questão' : 'questões'}!`;
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

// Ativa o modo app (PWA)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log("Modo Aplicativo pronto!"))
        .catch(err => console.log("Erro ao ativar Modo Aplicativo:", err));
}

// Reiniciar o simulado mantendo o mesmo ano e matéria
function reiniciarSimuladoAtual() {
    try {
        if (questoesFiltradas.length === 0) {
            alert("Não há questões para reiniciar.");
            return;
        }

        acertos = 0;      // Reseta os acertos
        indiceAtual = 0;  // Reseta para a primeira questão

        // Reembaralha as questões para não virem na mesma ordem de antes
        if (typeof cacheFiltro !== 'undefined') {
            questoesFiltradas = embaralhar(questoesFiltradas);
        }

        // Alterna as telas caso o aluno esteja na tela de pontuação
        document.getElementById('tela-pontuacao').classList.add('hidden');
        document.getElementById('tela-simulado').classList.remove('hidden');

        // Atualiza a tela com a primeira pergunta do recomeço
        mostrarQuestao();
    } catch (erro) {
        console.error("Erro ao reiniciar o simulador:", erro);
    }
}
