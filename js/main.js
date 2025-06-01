document.addEventListener('DOMContentLoaded', function() {
    // Verificar se o usuário veio da página de verificação
    const referrer = document.referrer;
    if (!referrer.includes('home.html')) {
        // Se o usuário não veio da página de verificação, redirecionar para a página inicial
        window.location.href = 'index.html';
    }
    
    // Adicionar animação de confete quando a página carrega
    createConfetti();
    
    // Salvar que o usuário completou a autenticação
    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('authTime', Date.now());
    
    // Exibir mensagem personalizada se houver
    const codeUsed = localStorage.getItem('lastCodeUsed');
    if (codeUsed) {
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Autenticado com o código: ${codeUsed}`;
        }
    }
});

function createConfetti() {
    const confettiCount = 200;
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Add sound effect for celebration
    playCelebrationSound();
}

function playCelebrationSound() {
    try {
        const audio = new Audio('sounds/success.mp3');
        audio.volume = 0.5;
        audio.play().catch(e => console.log('Audio play failed:', e));
    } catch (e) {
        console.log('Sound playback not supported');
    }
}