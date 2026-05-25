// Configuração do Google Sheets (troque pela SUA URL depois)
// PASSO 1: Crie uma planilha no Google Sheets
// PASSO 2: Vá em Extensões > Apps Script
// PASSO 3: Cole o código de backend que vou te dar
// PASSO 4: Publique como Web App e cole a URL aqui
const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzGNu7-WNAdIC_UGusi5F-Ssd7Qs2K3dbAjG8f5YQxKMX2KuI6bjsVpX8V-KMn5cwxL/exec";

// Abrir modal de adoção
function abrirFormulario(nomePet) {
    document.getElementById('petNomeModal').textContent = nomePet;
    document.getElementById('modal').style.display = 'block';
    document.getElementById('formAdocao').reset();
}

// Fechar modal
function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

// Fechar ao clicar fora do modal
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        fecharModal();
    }
}

// Enviar formulário
document.getElementById('formAdocao').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Coletar todos os dados
    const dados = {
        pet: document.getElementById('petNomeModal').textContent,
        data: new Date().toLocaleString('pt-BR'),
        
        // Dados pessoais
        nome: document.getElementById('nomeTutor').value,
        email: document.getElementById('emailTutor').value,
        telefone: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        
        // Moradia
        tipoMoradia: document.getElementById('tipoMoradia').value,
        tipoCasa: document.getElementById('tipoCasa').value,
        areaExterna: document.getElementById('areaExterna').value,
        
        // Família
        quantPessoas: document.getElementById('quantPessoas').value,
        criancas: document.getElementById('criancas').value,
        acordoFamiliar: document.getElementById('acordoFamiliar').value,
        
        // Outros animais
        outrosAnimais: document.getElementById('outrosAnimais').value,
        detalhesAnimais: document.getElementById('detalhesAnimais').value,
        cuidadosAnimais: document.getElementById('cuidadosAnimais').value,
        
        // Financeiro
        condicoesFinanceiras: document.getElementById('condicoesFinanceiras').value,
        gastoMensal: document.getElementById('gastoMensal').value,
        
        // Rotina
        tempoSozinho: document.getElementById('tempoSozinho').value,
        disponibilidade: document.getElementById('disponibilidade').value,
        
        // Motivação
        motivo: document.getElementById('motivo').value,
        historicoAnimais: document.getElementById('historicoAnimais').value,
        termoDevolucao: document.getElementById('termoDevolucao').value,
        
        // Extra
        mensagemExtra: document.getElementById('mensagemExtra').value
    };
    
    // Mostrar loading
    const btn = document.querySelector('.btn-enviar');
    const textoOriginal = btn.textContent;
    btn.textContent = '⏳ Enviando...';
    btn.disabled = true;
    
    try {
    // Tentar enviar para Google Sheets
    const response = await fetch(GOOGLE_SHEETS_URL, {  // ← G maiúsculo e GOOGLE
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
    });
    
    // Salvar localmente também (backup)
    salvarLocalmente(dados);
    
    // Sucesso
    alert("🐾 Obrigado " + dados.nome + "! Seu pedido de adoção do(a) " + dados.pet + " foi recebido com sucesso! Entraremos em contato em breve! 💚");
    
    fecharModal();
    
} catch (error) {
    console.error('Erro:', error);
    // Se falhar, salva localmente
    salvarLocalmente(dados);
    alert("✅ Cadastro salvo localmente! Entraremos em contato em breve.");
    fecharModal();
}
    
    // Resetar botão
    btn.textContent = textoOriginal;
    btn.disabled = false;
});

// Função para salvar localmente (backup)
function salvarLocalmente(dados) {
    let adocoes = localStorage.getItem('adocoes_patinhas');
    adocoes = adocoes ? JSON.parse(adocoes) : [];
    adocoes.push(dados);
    localStorage.setItem('adocoes_patinhas', JSON.stringify(adocoes));
    
    // Também baixar como arquivo
    const blob = new Blob([JSON.stringify(dados, null, 2)], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "adocao_" + dados.pet + "_" + Date.now() + ".json";
    link.click();
}
// ========== FUNÇÕES DO BOTÃO EXPORTAR JSON ==========

// Função para exportar TODOS os cadastros
function exportarTodosCadastros() {
    let adocoes = localStorage.getItem('adocoes_patinhas');
    
    if (adocoes) {
        adocoes = JSON.parse(adocoes);
        
        if (adocoes.length === 0) {
            alert('❌ Nenhum cadastro encontrado ainda!');
            return;
        }
        
        // Criar o arquivo JSON com todos os cadastros
        const dadosJson = JSON.stringify(adocoes, null, 2);
        const blob = new Blob([dadosJson], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        // Criar link para download
        const a = document.createElement('a');
        a.href = url;
        a.download = `adocoes_patinhas_${new Date().toLocaleDateString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`✅ ${adocoes.length} cadastro(s) exportado(s) com sucesso!`);
        
    } else {
        alert('❌ Nenhum cadastro encontrado ainda!');
    }
}

// Mostrar quantos cadastros já foram feitos
function atualizarContadorCadastros() {
    let adocoes = localStorage.getItem('adocoes_patinhas');
    let count = adocoes ? JSON.parse(adocoes).length : 0;
    
    // Verificar se já existe o contador, se não, criar
    let contador = document.getElementById('contadorCadastros');
    if (!contador) {
        const footer = document.querySelector('footer');
        if (footer) {
            const novoContador = document.createElement('p');
            novoContador.id = 'contadorCadastros';
            novoContador.className = 'contador';
            novoContador.style.fontSize = '11px';
            novoContador.style.marginTop = '10px';
            novoContador.style.color = '#888';
            footer.appendChild(novoContador);
            contador = novoContador;
        }
    }
    
    if (contador) {
        contador.textContent = `📋 ${count} cadastro(s) de adoção registrado(s)`;
    }
}
// ========== BOTÃO 1: EXPORTAR CADASTROS (adoções feitas) ==========

function exportarCadastros() {
    let adocoes = localStorage.getItem('adocoes_patinhas');
    
    if (adocoes) {
        adocoes = JSON.parse(adocoes);
        
        if (adocoes.length === 0) {
            alert('❌ Nenhum cadastro de adoção encontrado ainda!');
            return;
        }
        
        const dadosJson = JSON.stringify(adocoes, null, 2);
        const blob = new Blob([dadosJson], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `cadastros_adocoes_${new Date().toLocaleDateString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`✅ ${adocoes.length} cadastro(s) de adoção exportado(s)!`);
        
    } else {
        alert('❌ Nenhum cadastro de adoção encontrado ainda!');
    }
}

// ========== BOTÃO 2: EXPORTAR DADOS DOS PETS (lista de animais) ==========

function exportarPets() {
    const pets = [
        {
            nome: "Amora",
            tipo: "Cachorro",
            idade: 5,
            raca: "Pitbull",
            sexo: "Fêmea",
            descricao: "Brincalhona, dócil, companheira e dorminhoca"
        },
        {
            nome: "Ralph",
            tipo: "Cachorro",
            idade: 5,
            raca: "Pitbull",
            sexo: "Macho",
            descricao: "Calmo, carinhoso e reativo com alimentos"
        },
        {
            nome: "Colar",
            tipo: "Cachorro",
            idade: 5,
            raca: "Pitbull",
            sexo: "Macho",
            descricao: "Calmo, carinhoso e um pouco tímido"
        },
        {
            nome: "Marido",
            tipo: "Gato",
            idade: 5,
            raca: "SRD",
            sexo: "Macho",
            descricao: "Calmo, carinhoso e possui histórico de problemas urinários"
        },
        {
            nome: "Linda",
            tipo: "Cachorro",
            idade: 10,
            raca: "Pitbull",
            sexo: "Fêmea",
            descricao: "Calma, idosa e precisa de carinho e cuidados"
        },
        {
            nome: "Bob",
            tipo: "Cachorro",
            idade: 9,
            raca: "Pitbull",
            sexo: "Macho",
            descricao: "Calmo, carinhoso e reativo com outros animais"
        },
        {
            nome: "Lilico",
            tipo: "Gato",
            idade: 5,
            raca: "SRD",
            sexo: "Macho",
            descricao: "Agitado, tímido e demora para se adaptar"
        },
        {
            nome: "Willie",
            tipo: "Cachorro",
            idade: 6,
            raca: "Pharaoh Hound",
            sexo: "Macho",
            descricao: "Educado, calmo e muito carinhoso"
        }
    ];
    
    const dadosJson = JSON.stringify(pets, null, 2);
    const blob = new Blob([dadosJson], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista_pets_patinhas_${new Date().toLocaleDateString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    alert(`✅ ${pets.length} pets exportados com sucesso!`);
}

// ========== CRIAR OS DOIS BOTÕES ==========

function criarBotoesExportar() {
    // Verificar se os botões já existem
    if (document.getElementById('btnExportarCadastros')) return;
    
    const container = document.querySelector('.pets');
    if (!container) return;
    
    const btnContainer = document.createElement('div');
    btnContainer.className = 'botoes-exportar-container';
    btnContainer.innerHTML = `
        <div class="btn-group">
            <button id="btnExportarCadastros" class="btn-exportar btn-cadastros">
                📋 Exportar CADASTROS (adoções)
            </button>
            <button id="btnExportarPets" class="btn-exportar btn-pets">
                🐾 Exportar PETS (animais)
            </button>
        </div>
    `;
    
    // Inserir depois dos cards
    container.parentNode.insertBefore(btnContainer, document.querySelector('footer'));
    
    // Adicionar eventos
    document.getElementById('btnExportarCadastros').addEventListener('click', exportarCadastros);
    document.getElementById('btnExportarPets').addEventListener('click', exportarPets);
}

// Mostrar quantos cadastros já foram feitos
function atualizarContadorCadastros() {
    let adocoes = localStorage.getItem('adocoes_patinhas');
    let count = adocoes ? JSON.parse(adocoes).length : 0;
    
    let contador = document.getElementById('contadorCadastros');
    if (!contador) {
        const footer = document.querySelector('footer');
        if (footer) {
            const novoContador = document.createElement('p');
            novoContador.id = 'contadorCadastros';
            novoContador.className = 'contador';
            footer.appendChild(novoContador);
            contador = novoContador;
        }
    }
    
    if (contador) {
        contador.textContent = `📋 ${count} cadastro(s) de adoção registrado(s)`;
    }
}

// Chamar as funções quando a página carregar
window.addEventListener('load', function() {
    criarBotoesExportar();
    atualizarContadorCadastros();
});