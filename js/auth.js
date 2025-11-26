// auth.js - Sistema de autenticação visual no header

// Função auxiliar para decodificar o payload de um JWT (sem verificação de assinatura)
function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar JWT:", e);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    // Função para verificar se o usuário está logado
    function checkAuthStatus() {
        const token = localStorage.getItem('token');

        if (token) {
            const payload = decodeJwt(token);
            
            if (payload && payload.email) {
                // Usuário está logado. O nome será o email (ou parte dele)
                mostrarUsuarioLogado(payload);
            } else {
                // Token inválido ou expirado
                localStorage.removeItem('token');
                localStorage.removeItem('usuarioLogado');
                mostrarLinksAuth();
            }
        } else {
            // Usuário não está logado
            mostrarLinksAuth();
        }
    }

    // Mostrar informações do usuário logado
    function mostrarUsuarioLogado(payload) {
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            if (userName) {
                // Pega a parte do email antes do @ para usar como "nome"
                const nomeDisplay = payload.email.split('@')[0];
                userName.textContent = nomeDisplay;
            }
        }
    }

    // Mostrar links de Entrar/Registrar
    function mostrarLinksAuth() {
        if (userInfo) userInfo.style.display = 'none';
        if (authLinks) authLinks.style.display = 'flex';
    }

    // Função de logout
    function realizarLogout() {
        // Remove dados do localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioLogado');
        
        // Mostra mensagem de sucesso
        alert('✅ Logout realizado com sucesso!');
        
        // Atualiza a interface
        mostrarLinksAuth();
        
        // Redireciona para a página inicial
        window.location.href = '../index.html'; // Ajustado para voltar ao index.html
    }

    // Event listener para o botão de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            realizarLogout();
        });
    }

    // Verifica o status de autenticação ao carregar a página
    checkAuthStatus();
});
