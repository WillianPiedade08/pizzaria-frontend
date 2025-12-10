// auth.js - Sistema de autenticação visual no header

document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    // Mostrar informações do usuário logado
    function mostrarUsuarioLogado(nomeDisplay) {
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            if (userName) {
                userName.textContent = nomeDisplay;
            }
        }
    }

    // Mostrar links de Entrar/Registrar
    function mostrarLinksAuth() {
        if (userInfo) userInfo.style.display = 'none';
        if (authLinks) authLinks.style.display = 'flex';
    }

    // Verifica se o usuário está logado
    function checkAuthStatus() {
        const token = localStorage.getItem('token');
        const cachedUser = localStorage.getItem('usuarioLogado');

        // Se tem token E dados do usuário, mostra o usuário
        if (token && cachedUser) {
            try {
                const user = JSON.parse(cachedUser);
                const nomeDisplay = user.nome || user.email || 'Usuário';
                mostrarUsuarioLogado(nomeDisplay);
                return;
            } catch (e) {
                console.warn("Erro ao parse usuarioLogado:", e);
            }
        }

        // Se não tem dados, limpa tudo e mostra links de login
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        mostrarLinksAuth();
    }

    // Função de logout
    function realizarLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');

        alert('✅ Logout realizado com sucesso!');

        mostrarLinksAuth();
        // Se o botão de logout for um link com href, usa esse href para redirecionar.
        const redirectUrl = (logoutBtn && logoutBtn.getAttribute && logoutBtn.getAttribute('href')) || '../index.html';
        window.location.href = redirectUrl;
    }

    // Evento de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            realizarLogout();
        });
    }

    // Checa login ao carregar
    checkAuthStatus();
});
