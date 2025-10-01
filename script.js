class Personagem {
    constructor(nome, descricao, imagem) {
        this.nome = nome;
        this.descricao = descricao;
        this.imagem = imagem;
        this.pontuacao = 0;
    }
}

class Pergunta {
    constructor(texto, opcoes) {
        this.texto = texto;
        this.opcoes = opcoes; 
    }
}

class Quiz {
    constructor(perguntas, personagens) {
        this.perguntas = perguntas;
        this.personagens = personagens;
        this.perguntaAtual = 0;
        this.respostas = Array(perguntas.length).fill(null);
    }

    mostrarTela(tela) {
        document.querySelectorAll('.tela').forEach(s => s.classList.remove('ativa'));
        document.getElementById(tela).classList.add('ativa');
    }

    mostrarPergunta() {
        const pergunta = this.perguntas[this.perguntaAtual];
        document.getElementById('texto-pergunta').textContent = pergunta.texto;
        document.getElementById('pergunta-atual').textContent = this.perguntaAtual + 1;
        document.getElementById('preenchimento-progresso').style.width = ((this.perguntaAtual + 1) / this.perguntas.length * 100) + '%';
        const containerOpcoes = document.getElementById('container-opcoes');
        containerOpcoes.innerHTML = '';
        pergunta.opcoes.forEach((opcao, i) => {
            const btn = document.createElement('button');
            btn.className = 'botao-opcao';
            btn.textContent = opcao.texto;
            if (this.respostas[this.perguntaAtual] === i) btn.classList.add('selecionada');
            btn.onclick = () => this.selecionarOpcao(i);
            containerOpcoes.appendChild(btn);
        });
        document.getElementById('btn-anterior').disabled = this.perguntaAtual === 0;
        document.getElementById('btn-proxima').disabled = this.respostas[this.perguntaAtual] === null;
        document.getElementById('btn-proxima').textContent = this.perguntaAtual === this.perguntas.length - 1 ? 'Finalizar' : 'Próxima';
    }

    selecionarOpcao(i) {
        this.respostas[this.perguntaAtual] = i;
        this.mostrarPergunta();
    }

    proximaPergunta() {
        if (this.respostas[this.perguntaAtual] === null) return;
        if (this.perguntaAtual < this.perguntas.length - 1) {
            this.perguntaAtual++;
            this.mostrarPergunta();
        } else {
            this.finalizarQuiz();
        }
    }

    perguntaAnterior() {
        if (this.perguntaAtual > 0) {
            this.perguntaAtual--;
            this.mostrarPergunta();
        }
    }

    finalizarQuiz() {
        this.personagens.forEach(p => p.pontuacao = 0);
        this.respostas.forEach((resposta, idx) => {
            if (resposta !== null) {
                const pontos = this.perguntas[idx].opcoes[resposta].pontuacoes;
                for (let nomePersonagem in pontos) {
                    const personagem = this.personagens.find(p => p.nome === nomePersonagem);
                    if (personagem) personagem.pontuacao += pontos[nomePersonagem];
                }
            }
        });
        let resultado = this.personagens.reduce((a, b) => a.pontuacao > b.pontuacao ? a : b);
        document.getElementById('nome-personagem').textContent = resultado.nome;
        document.getElementById('pontuacao-personagem').textContent = resultado.pontuacao;
        document.getElementById('descricao-personagem').textContent = resultado.descricao;
        document.getElementById('img-personagem').src = resultado.imagem;
        document.getElementById('img-personagem').alt = resultado.nome;
        this.mostrarTela('tela-resultado');
    }

    reiniciarQuiz() {
        this.perguntaAtual = 0;
        this.respostas = Array(this.perguntas.length).fill(null);
        this.mostrarTela('tela-boasvindas');
    }

    compartilharResultado() {
        const nome = document.getElementById('nome-personagem').textContent;
        const textoCompartilhar = `Descobri que meu herói Marvel é ${nome}! Faça o quiz e descubra o seu também!`;
        if (navigator.share) {
            navigator.share({ title: 'Meu Herói Marvel', text: textoCompartilhar, url: window.location.href });
        } else {
            navigator.clipboard.writeText(textoCompartilhar + ' ' + window.location.href)
                .then(() => alert('Resultado copiado para a área de transferência!'))
                .catch(() => alert('Não foi possível copiar o resultado.'));
        }
    }
}


const personagens = [
    new Personagem("Doutor Estranho", "Suas respostas revelam uma mente brilhante e analítica, sempre em busca de conhecimento e soluções além do convencional, você é a linha de defesa contra ameaças que a maioria das pessoas nem sabe que existem - equilibrando múltiplas realidades e tomando decisões impossíveis para proteger o mundo como o conhecemos.", 'https://cdn.discordapp.com/attachments/1295743227206434857/1423001708442816553/0a3d493a94ecf81dbf85fb0dc82b2afd.png?ex=68deb91d&is=68dd679d&hm=6b44147e4cefca84c86d415bf2fed47db51db313f6dd30ed1d3bbc02a04579f1&'),
    new Personagem("Viúva Negra", "Suas respostas revelam um perfil estratégico, resiliente e altamente tático, você é a pessoa em quem os outros confiam nas situações mais perigosas - não por superpoderes, mas por sua inteligência, habilidades e determinação inabaláveis.", 'https://cdn.discordapp.com/attachments/1295743227206434857/1423003518083666064/Ilustracao.png?ex=68debacc&is=68dd694c&hm=20feab3475770b5c6e9341b8d6e98a257c62f41e37183f0d66779b95db5557e2&'),
    new Personagem("Homem de Ferro", "Você é o Homem de Ferro! Um gênio bilionário, playboy e filantropo com uma inteligência incomparável e um dom para a inovação tecnológica. Sua mente brilhante e sua capacidade de criar são suas maiores armas. Apesar de um exterior sarcástico, você possui um coração que, no fundo, se preocupa profundamente com o bem-estar do mundo. Você não tem medo de riscos e sempre encontra uma maneira de sair por cima, geralmente com uma armadura incrível. \"Eu sou o Homem de Ferro\"", 'https://cdn.discordapp.com/attachments/1295743227206434857/1423003853862731928/c9a04baa9ef3be6ebca4e20b76e4e7b3.png?ex=68debb1c&is=68dd699c&hm=f1682a5eebf321c666327bfda7cab0b3b947b69e8b062ac3dd351623cabf6a2b&'),
    new Personagem("Deadpool", "Você é o mestre do caos com um senso de humor afiado e um coração escondido no meio da bagunça. Improvisa, zoa o perigo e encara tudo do seu jeito irreverente, corajoso e imprevisível. Pode não seguir as regras, mas sempre deixa sua marca. Ser você é ser um show à parte... e ninguém reclama (muito). 💋💅", 'https://media0.giphy.com/media/v1.Y2lkPTZjMDliOTUybWd3d3dscDl5bWI0c3p2c3A4MWJzN3Ixc2QwajFucjg5bHN1dDA0dyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/57ZvMMkuBIVMlU88Yh/source.gif'),
    new Personagem("Homem-Aranha", "Você é movido por empatia, coragem e senso de responsabilidade. Sempre pensa nos outros antes de agir e acredita que cada pessoa pode fazer a diferença no mundo. Mesmo diante das dificuldades, mantém o bom humor e não desiste facilmente. \"Com grandes poderes vêm grandes responsabilidades.\"", 'https://i.pinimg.com/736x/04/f2/6d/04f26d31cec87620ab556867e7abd809.jpg')
];


const perguntas = [
    new Pergunta("O que você faria ao descobrir algo misterioso na sua cidade?", [
        { texto: "Estudaria o fenômeno usando conhecimento e lógica.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Investigaria discretamente sem chamar atenção.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Criaria algum dispositivo para analisar a situação.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Zoaria o perigo enquanto tenta entender o que está rolando.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Tentaria cuidar das pessoas ao redor e avisar alguém.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("O que mais combina com sua personalidade?", [
        { texto: "Sabedoria e autodomínio.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Determinação e sigilo.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Criatividade e confiança.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Humor e caos controlado.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Empatia e senso de responsabilidade.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("Você precisa tomar uma decisão difícil que pode afetar milhares de vidas. O que você faz?", [
        { texto: "Analiso todas as possibilidades de forma fria e calculada.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Confio nos meus instintos e na minha experiência.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Tento criar uma solução que me permita ganhar sem perder nada.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Faço o que parece certo no momento. Se der errado, improviso depois.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Escolho o que for mais justo, mesmo que me prejudique.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("Como é seu estilo de liderança?", [
        { texto: "Centralizador e estratégico — gosto de manter o controle.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Discreto e eficiente — lidero pelo exemplo, não pela voz.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Carismático, ousado e às vezes arrogante — mas entrego resultados.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Caótico e inspirador — ninguém sabe como, mas funciona.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Coletivo e empático — ouço todos e busco consenso.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("O que você mais valoriza em uma amizade?", [
        { texto: "Inteligência e compreensão mútua.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Lealdade silenciosa e confiável.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Admiração mútua e troca de ideias afiadas.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Alguém que aguente suas piadas (e talvez leve uma junto).", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Companheirismo verdadeiro e apoio constante.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("Você é colocado em uma missão onde terá que trabalhar com pessoas que não confia. Qual é sua abordagem?", [
        { texto: "Crio planos paralelos e monitoro tudo — confiança é construída, não concedida.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Observo atentamente e deixo os outros se revelarem com o tempo.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Assumo a liderança e tento mantê-los ocupados com tarefas específicas.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Provoco, brinco e crio o caos — se eles quiserem me acompanhar, boa sorte.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Tento unir o grupo pelo diálogo e por um objetivo comum.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("Você precisa renunciar a algo importante por um bem maior. Como você age?", [
        { texto: "Avalio todas as consequências. Se for necessário, abro mão — mas a escolha é minha.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Sacrifico em silêncio. Ninguém precisa saber o que perdi.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Tento negociar para não ter que perder nada.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Reclamo, dramatizo, mas no fundo... acabo fazendo.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Faço sem pensar duas vezes, mesmo que me destrua.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("Como você lida com sua identidade pessoal?", [
        { texto: "Eu me redefini completamente para cumprir meu propósito.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Me escondo atrás de versões que os outros acreditam.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Transformei minha identidade em marca registrada.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Quem sou eu? Depende do dia e da vibe.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Luto diariamente para ser fiel a quem realmente sou.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("Quando tudo dá errado, qual é sua reação natural?", [
        { texto: "Tento manter o controle e encontrar uma saída racional.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Me isolo, reavalio tudo e traço um novo plano.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Faço piada, crio algo do nada e viro o jogo.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Grito, atiro, explodo coisas — mas de forma cômica.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Entro em conflito interno, mas jamais desisto.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ]),
    new Pergunta("Qual dessas situações te deixaria mais desconfortável?", [
        { texto: "Perder o controle de algo que você domina completamente.", pontuacoes: {"Doutor Estranho": 5, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Ter que confiar 100% em alguém que você mal conhece.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 5, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Admitir que falhou publicamente.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 5, "Deadpool": 1, "Homem-Aranha": 1} },
        { texto: "Ficar em silêncio absoluto por mais de 5 minutos.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 5, "Homem-Aranha": 1} },
        { texto: "Ser odiado pelas pessoas que você está tentando ajudar.", pontuacoes: {"Doutor Estranho": 1, "Viúva Negra": 1, "Homem de Ferro": 1, "Deadpool": 1, "Homem-Aranha": 5} }
    ])
];


const quiz = new Quiz(perguntas, personagens);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('total-perguntas').textContent = quiz.perguntas.length;
    document.getElementById('btn-iniciar-quiz').onclick = () => {
        quiz.mostrarTela('tela-quiz');
        quiz.perguntaAtual = 0;
        quiz.respostas = Array(quiz.perguntas.length).fill(null);
        quiz.mostrarPergunta();
    };
    document.getElementById('btn-anterior').onclick = () => quiz.perguntaAnterior();
    document.getElementById('btn-proxima').onclick = () => quiz.proximaPergunta();
    document.getElementById('btn-refazer').onclick = () => quiz.reiniciarQuiz();
    document.getElementById('btn-compartilhar').onclick = () => quiz.compartilharResultado();
});
