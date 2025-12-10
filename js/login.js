const API_URL = "https://api-pizzas-seu-ze.vercel.app/"; // URL da sua API

document.addEventListener('DOMContentLoaded', () => {
    const loginWrapper = document.getElementById('login-form-wrapper');
    const signupWrapper = document.getElementById('signup-form-wrapper');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    
    const formCadastro = document.getElementById('form-cadastro');
    const formLogin = document.getElementById('form-login');

    // ========================================
    // LÓGICA: troca entre login e cadastro
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
    // Prevenir múltiplos envios
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
    // CADASTRO (POST /usuarios)
    // ========================================
    handleSubmit(formCadastro, async () => {
        const nome = formCadastro.querySelector('input[name="nome"]').value.trim();
        const email = formCadastro.querySelector('input[name="email"]').value.trim();
        const telefone = formCadastro.querySelector('input[name="telefone"]').value.trim();
        const cpf = formCadastro.querySelector('input[name="cpf"]').value.trim().replace(/\D/g, '');
        const senha = formCadastro.querySelector('input[name="senha"]').value;

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

        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, telefone, cpf, senha })
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Cadastro realizado! Agora faça login.");
                showLoginLink.click();
                formCadastro.reset();
            } else {
                alert(`❌ ${data.error || "Erro ao cadastrar."}`);
            }
        } catch (error) {
            console.error("❌ Erro:", error);
            alert("Erro ao conectar com o servidor.");
        }
    }, "Cadastrando...");

    // ========================================
    // LOGIN (POST /login)
    // ========================================
    handleSubmit(formLogin, async () => {
        const email = formLogin.querySelector('input[name="email"]').value.trim();
        const senha = formLogin.querySelector('input[name="senha"]').value;

        if (!email || !senha) {
            alert("⚠️ E-mail e senha obrigatórios.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha })
            });

            const data = await response.json();

            if (response.ok) {
                // Salvar token
                localStorage.setItem('token', data.token);

                // --- CORREÇÃO IMPORTANTE ---
                // Pegamos somente o texto antes do @
                const nomeFormatado = email.split('@')[0];

                localStorage.setItem('usuarioLogado', JSON.stringify({
                    nome: nomeFormatado,
                    email: email
                }));

                alert("✅ Login bem-sucedido!");
                window.location.href = "../index.html";

            } else {
                alert(`❌ ${data.error || "E-mail ou senha inválidos."}`);
            }
        } catch (error) {
            console.error("❌ Erro:", error);
            alert("Erro ao conectar ao servidor.");
        }
    }, "Entrando...");

    // ========================================
    // MÁSCARA CPF
    // ========================================
    const cpfInput = formCadastro.querySelector('input[name="cpf"]');
    if (cpfInput) {
        cpfInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);

            if (v.length > 9) {
                v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
            } else if (v.length > 6) {
                v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
            } else if (v.length > 3) {
                v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
            }

            e.target.value = v;
        });
    }

    // ========================================
    // MÁSCARA TELEFONE
    // ========================================
    const telefoneInput = formCadastro.querySelector('input[name="telefone"]');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);

            if (v.length > 10) {
                v = v.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
            } else if (v.length > 6) {
                v = v.replace(/(\d{2})(\d{4})(\d{1,4})/, "($1) $2-$3");
            } else if (v.length > 2) {
                v = v.replace(/(\d{2})(\d{1,5})/, "($1) $2");
            }

            e.target.value = v;
        });
    }
});
