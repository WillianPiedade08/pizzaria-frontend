const API_URL = "https://api-pizzas-seu-ze.vercel.app"; // **ATENÇÃO: Mude para a URL da sua API na Vercel**

document.addEventListener('DOMContentLoaded', () => {
    const loginWrapper = document.getElementById('login-form-wrapper');
    const signupWrapper = document.getElementById('signup-form-wrapper');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    
    const formCadastro = document.getElementById('form-cadastro');
    const formLogin = document.getElementById('form-login');

    // ========================================
    // LÓGICA DE TRANSIÇÃO ENTRE FORMULÁRIOS
    // ========================================
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginWrapper.classList.remove('is-active');
        signupWrapper.classList.add('is-active');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupWrapper.classList.remove('is-active');
        loginWrapper.classList.add('is-active');
    });

    // ========================================
    // FUNÇÃO AUXILIAR PARA PREVENIR CLIQUES MÚLTIPLOS
    // ========================================
    function handleSubmit(form, fetchFn, buttonText = "Enviando...") {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (submitButton.disabled) return;

            submitButton.disabled = true;
            submitButton.textContent = buttonText;

            try {
                await fetchFn(e);
            } catch (err) {
                console.error("❌ Erro no submit:", err);
                alert("Erro de conexão. Tente novamente.");
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }
        });
    }

    // ========================================
    // CADASTRO (Criar Conta)
    // Endpoint: POST /usuarios
    // ========================================
    handleSubmit(formCadastro, async () => {
        const nome = formCadastro.querySelector('input[name="nome"]').value.trim();
        const email = formCadastro.querySelector('input[name="email"]').value.trim();
        const telefone = formCadastro.querySelector('input[name="telefone"]').value.trim();
        const cpf = formCadastro.querySelector('input[name="cpf"]').value.trim().replace(/\D/g, ''); // Remove máscara para enviar
        const senha = formCadastro.querySelector('input[name="senha"]').value;

        // Validação no frontend
        if (!nome || !email || !telefone || !cpf || !senha) {
            alert("⚠️ Preencha todos os campos obrigatórios.");
            return;
        }

        if (senha.length < 6) {
            alert("⚠️ A senha deve ter pelo menos 6 caracteres.");
            return;
        }
        
        if (cpf.length !== 11) {
            alert("⚠️ O CPF deve ter 11 dígitos.");
            return;
        }

        console.log("📤 Enviando cadastro:", { nome, email, telefone, cpf });

        try {
            // Rota corrigida para /usuarios
            const response = await fetch(`${API_URL}/usuarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, telefone, cpf, senha })
            });

            let data;
            try {
                data = await response.json();
            } catch {
                alert("❌ Erro ao processar resposta do servidor.");
                return;
            }

            console.log("📥 Resposta do servidor:", data);

            if (response.ok) {
                alert("✅ Usuário cadastrado com sucesso! Faça login para continuar.");
                showLoginLink.click();
                formCadastro.reset();
            } else {
                alert(`❌ ${data.error || "Erro ao cadastrar usuário."}`);
            }
        } catch (error) {
            console.error("❌ Erro na requisição:", error);
            alert("❌ Erro de conexão com o servidor. Verifique sua internet.");
        }
    }, "Cadastrando...");

    // ========================================
    // LOGIN (Entrar)
    // Endpoint: POST /login
    // ========================================
    handleSubmit(formLogin, async () => {
        const email = formLogin.querySelector('input[name="email"]').value.trim();
        const senha = formLogin.querySelector('input[name="senha"]').value;

        if (!email || !senha) {
            alert("⚠️ E-mail e senha são obrigatórios.");
            return;
        }

        console.log("📤 Enviando login:", { email });

        try {
            // Rota corrigida para /usuarios/login
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            let data;
            try {
                data = await response.json();
            } catch {
                alert("❌ Erro ao processar resposta do servidor.");
                return;
            }

            console.log("📥 Resposta do servidor:", data);

            if (response.ok) {
                // Salva apenas o token no localStorage. Os dados do usuário serão extraídos do token.
                localStorage.setItem('token', data.token);
                // O objeto 'usuarioLogado' não é mais necessário, pois os dados serão decodificados do token.
                // No entanto, para compatibilidade com o carrinho.js, vamos salvar o ID do usuário se ele estiver no token.
                // O auth.js agora tem a função de decodificar o token.
                
                // O objeto 'data' da API não contém o nome, apenas o token.
                // O token contém o ID, email e tipo.
                // Vamos salvar o objeto de resposta completo para o carrinho.js usar o 'tipo' se precisar.
                localStorage.setItem('usuarioLogado', JSON.stringify(data));

                alert('✅ Login bem-sucedido!');
                // Redireciona para a página principal (index.html)
                window.location.href = "../index.html"; 
            } else {
                alert(`❌ ${data.error || "E-mail ou senha inválidos."}`);
            }
        } catch (error) {
            console.error("❌ Erro na requisição:", error);
            alert("❌ Erro de conexão com o servidor. Verifique sua internet.");
        }
    }, "Entrando...");

    // ========================================
    // MÁSCARA PARA CPF
    // ========================================
    const cpfInput = formCadastro.querySelector('input[name="cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            // Aplica máscara: 000.000.000-00
            if (value.length > 9) {
                value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            } else if (value.length > 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (value.length > 3) {
                value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            
            e.target.value = value;
        });
    }

    // ========================================
    // MÁSCARA PARA TELEFONE
    // ========================================
    const telefoneInput = formCadastro.querySelector('input[name="telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            
            // Aplica máscara: (00) 00000-0000 ou (00) 0000-0000
            if (value.length > 10) {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
            }
            
            e.target.value = value;
        });
    }
});
