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

// URL base da sua API
const API_BASE_URL = 'https://api-pizzas-seu-ze.vercel.app/usuarios';

// Função para buscar os dados do usuário na API
async function fetchUserData(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Se a resposta não for OK (ex: 401 Unauthorized), lança um erro
            throw new Error(`Erro ao buscar dados do usuário: ${response.statusText}`);
        }

        const data = await response.json();
        return data.user; // Assumindo que a API retorna um objeto { user: { nome, email, ... } }

    } catch (error) {
        console.error("Falha na requisição de dados do usuário:", error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const authLinks = document.getElementById('auth-links');
    const userInfo = document.getElementById('user-info');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');

    // Função para verificar se o usuário está logado
    async function checkAuthStatus() {
        const token = localStorage.getItem('token');
        const cachedUser = localStorage.getItem('usuarioLogado');

        if (token) {
            const payload = decodeJwt(token);
            
            if (payload && payload.email) {
                // 1. Tenta usar dados em cache
                if (cachedUser) {
                    const user = JSON.parse(cachedUser);
                    mostrarUsuarioLogado(user.nome || user.email);
                    return;
                }

                // 2. Se não houver cache, busca na API
                const userData = await fetchUserData(token);

                if (userData && (userData.nome || userData.email)) {
                    // Armazena os dados completos do usuário no cache
                    localStorage.setItem('usuarioLogado', JSON.stringify(userData));
                    mostrarUsuarioLogado(userData.nome || userData.email);
                } else {
                    // Falha ao buscar dados, trata como token inválido
                    console.warn("Token válido, mas falha ao obter dados do usuário. Limpando sessão.");
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuarioLogado');
                    mostrarLinksAuth();
                }
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
    function mostrarUsuarioLogado(nomeDisplay) {
        if (authLinks) authLinks.style.display = 'none';
        if (userInfo) {
            userInfo.style.display = 'flex';
            if (userName) {
                // Usa o nome completo ou email retornado pela API
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


