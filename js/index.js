// Função para gerar um código aleatório de 12 caracteres
function generateInviteCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 12; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Função para atualizar o código e armazená-lo
function updateInviteCode() {
    const code = generateInviteCode();
    document.getElementById('inviteCode').textContent = code;
    
    // Armazenar o código e o timestamp de expiração
    const expirationTime = Date.now() + 60000; // 60 segundos a partir de agora
    localStorage.setItem('inviteCode', code);
    localStorage.setItem('inviteCodeExpiration', expirationTime);
    
    // Reiniciar o contador
    remainingSeconds = 60;
    updateTimer();
    updateProgressBar();
}

// Função para atualizar o timer
let remainingSeconds = 60;
function updateTimer() {
    document.getElementById('timer').textContent = `Expira em: ${remainingSeconds} segundos`;
    
    if (remainingSeconds <= 0) {
        updateInviteCode();
    } else {
        remainingSeconds--;
        setTimeout(updateTimer, 1000);
    }
}

// Função para atualizar a barra de progresso
function updateProgressBar() {
    const progressBar = document.querySelector('.timer-progress');
    
    // Reset the animation
    progressBar.style.transition = 'none';
    progressBar.style.width = '100%';
    
    setTimeout(() => {
        progressBar.style.transition = 'width 60s linear';
        progressBar.style.width = '0%';
    }, 50);
}

// Função para copiar o código para a área de transferência
function copyToClipboard() {
    const code = document.getElementById('inviteCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const copyBtn = document.querySelector('.copy-btn');
        copyBtn.textContent = 'Copiado!';
        setTimeout(() => {
            copyBtn.textContent = 'Copiar';
        }, 2000);
    });
}

// Verificar se já existe um código válido
document.addEventListener('DOMContentLoaded', function() {
    const storedExpiration = localStorage.getItem('inviteCodeExpiration');
    
    // Adicionar evento de clique ao botão de copiar
    document.querySelector('.copy-btn').addEventListener('click', copyToClipboard);
    
    if (storedExpiration && Date.now() < parseInt(storedExpiration)) {
        // Calcular o tempo restante
        remainingSeconds = Math.floor((parseInt(storedExpiration) - Date.now()) / 1000);
        document.getElementById('inviteCode').textContent = localStorage.getItem('inviteCode');
        updateTimer();
        
        // Atualizar a barra de progresso com o tempo restante
        const progressBar = document.querySelector('.timer-progress');
        progressBar.style.transition = `width ${remainingSeconds}s linear`;
        progressBar.style.width = '0%';
    } else {
        // Gerar um novo código
        updateInviteCode();
    }
});