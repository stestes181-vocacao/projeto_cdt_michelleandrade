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
        const response = await fetch(GOOGLE_SHEETS_URL, {
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
        alert(🐾 Obrigado ${dados.nome}!\n\nSeu pedido de adoção do(a) ${dados.pet} foi recebido com sucesso!\n\nEntraremos em contato em breve pelo WhatsApp ${dados.telefone}.\n\nAgradecemos seu interesse em dar um lar responsável! 💚);
        
        fecharModal();
        
    } catch (error) {
        console.error('Erro:', error);
        // Se falhar, salva localmente
        salvarLocalmente(dados);
        alert(✅ Cadastro salvo localmente!\n\nEntraremos em contato em breve.\n\n(Por motivo técnico, seu cadastro foi salvo no navegador. Em breve entraremos em contato!));
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
    link.download = adocao_${dados.pet}_${Date.now()}.json;
    link.click();
}