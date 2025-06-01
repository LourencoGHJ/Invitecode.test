document.addEventListener('DOMContentLoaded', function() {
    const submitBtn = document.getElementById('submitBtn');
    const inviteCodeInput = document.getElementById('inviteCode');
    const pasteBtn = document.getElementById('pasteBtn');
    const messageElement = document.getElementById('message');
    const timerElement = document.getElementById('timer');
    const leftDoor = document.querySelector('.left-door');
    const rightDoor = document.querySelector('.right-door');
    
    // Dialog elements
    const confirmDialog = document.getElementById('confirmDialog');
    const dialogCode = document.getElementById('dialogCode');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    
    // Inicializar partículas de fundo
    initParticles();
    
    // Verificar se há código na área de transferência ao carregar a página
    checkClipboardOnLoad();
    
    // Função para verificar o código de convite
    function checkInviteCode() {
        const enteredCode = inviteCodeInput.value.trim();
        const storedCode = localStorage.getItem('inviteCode');
        const expirationTime = localStorage.getItem('inviteCodeExpiration');
        
        // Verificar se o código existe e não expirou
        if (!storedCode || !expirationTime || Date.now() > parseInt(expirationTime)) {
            messageElement.textContent = 'O código expirou. Por favor, obtenha um novo código.';
            messageElement.style.color = '#e74c3c';
            shakeInput();
            return;
        }
        
        if (enteredCode === storedCode) {
            messageElement.textContent = 'Código válido! Entrando...';
            messageElement.style.color = '#27ae60';
            
            // Salvar o código usado para exibir na página principal
            localStorage.setItem('lastCodeUsed', enteredCode);
            
            // Make doors visible before animation
            leftDoor.style.opacity = '1';
            rightDoor.style.opacity = '1';
            
            // Animar as portas abrindo
            leftDoor.classList.add('open');
            rightDoor.classList.add('open');
            
            // Redirecionar para a página principal após a animação
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 2000);
        } else {
            messageElement.textContent = 'Código inválido. Tente novamente.';
            messageElement.style.color = '#e74c3c';
            inviteCodeInput.value = '';
            shakeInput();
        }
    }
    
    // Função para verificar a área de transferência ao carregar a página
    async function checkClipboardOnLoad() {
        try {
            // Verificar se o navegador suporta a API Clipboard
            if (navigator.clipboard && navigator.clipboard.readText) {
                const clipboardText = await navigator.clipboard.readText();
                
                // Verificar se o texto da área de transferência corresponde ao padrão do código (12 caracteres alfanuméricos)
                if (clipboardText && clipboardText.length === 12 && /^[A-Z0-9]+$/.test(clipboardText)) {
                    // Mostrar diálogo de confirmação
                    showConfirmDialog(clipboardText);
                }
            }
        } catch (err) {
            console.log('Não foi possível acessar a área de transferência:', err);
        }
    }
    
    // Função para mostrar o diálogo de confirmação
    function showConfirmDialog(code) {
        // Exibir o código no diálogo
        dialogCode.textContent = code;
        
        // Mostrar o diálogo
        confirmDialog.style.display = 'flex';
        
        // Configurar eventos dos botões
        confirmYes.onclick = function() {
            inviteCodeInput.value = code;
            confirmDialog.style.display = 'none';
            inviteCodeInput.classList.add('input-highlight');
            setTimeout(() => {
                inviteCodeInput.classList.remove('input-highlight');
            }, 1000);
        };
        
        confirmNo.onclick = function() {
            confirmDialog.style.display = 'none';
        };
    }
    
    // Função para colar o código da área de transferência
    async function pasteFromClipboard() {
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText) {
                // Verificar se o texto da área de transferência corresponde ao padrão do código
                const formattedCode = clipboardText.substring(0, 12).toUpperCase();
                if (formattedCode.length > 0) {
                    showConfirmDialog(formattedCode);
                }
            }
        } catch (err) {
            console.log('Não foi possível acessar a área de transferência:', err);
            messageElement.textContent = 'Não foi possível acessar a área de transferência.';
            messageElement.style.color = '#e74c3c';
        }
    }
    
    // Função para animar o input quando o código é inválido
    function shakeInput() {
        inviteCodeInput.classList.add('shake');
        setTimeout(() => {
            inviteCodeInput.classList.remove('shake');
        }, 500);
    }
    
    // Atualizar o timer
    function updateRemainingTime() {
        const expirationTime = localStorage.getItem('inviteCodeExpiration');
        
        if (expirationTime) {
            const remainingTime = parseInt(expirationTime) - Date.now();
            
            if (remainingTime > 0) {
                const seconds = Math.ceil(remainingTime / 1000);
                timerElement.textContent = `Tempo restante: ${seconds} segundos`;
                setTimeout(updateRemainingTime, 1000);
            } else {
                timerElement.textContent = 'O código expirou. Por favor, obtenha um novo código.';
            }
        } else {
            timerElement.textContent = 'Nenhum código disponível. Por favor, obtenha um código.';
        }
    }
    
    // Função para inicializar partículas de fundo
    function initParticles() {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.querySelector('.container').appendChild(particlesContainer);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            particlesContainer.appendChild(particle);
        }
    }
    
    // Iniciar o timer
    updateRemainingTime();
    
    // Adicionar evento de clique ao botão
    submitBtn.addEventListener('click', checkInviteCode);
    
    // Adicionar evento de clique ao botão de colar
    pasteBtn.addEventListener('click', pasteFromClipboard);
    
    // Permitir envio ao pressionar Enter
    inviteCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkInviteCode();
        }
    });
    
    // Detectar quando o texto é colado diretamente no input
    inviteCodeInput.addEventListener('paste', function(e) {
        // Prevenir o comportamento padrão de colar
        e.preventDefault();
        
        // Obter o texto da área de transferência
        const clipboardData = e.clipboardData || window.clipboardData;
        const pastedText = clipboardData.getData('text');
        
        // Mostrar diálogo de confirmação
        if (pastedText) {
            const formattedCode = pastedText.substring(0, 12).toUpperCase();
            if (formattedCode.length > 0) {
                showConfirmDialog(formattedCode);
            }
        }
    });
    
    // Focar no campo de entrada ao carregar a página
    inviteCodeInput.focus();
});