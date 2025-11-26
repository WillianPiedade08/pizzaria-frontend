const form = document.getElementById("reservaForm");
const overlay = document.getElementById("overlayMensagem");
const dataSpan = document.getElementById("dataReserva");
const horaSpan = document.getElementById("horaReserva");
const voltarBtn = document.getElementById("voltarBtn");

// ========================================
// NÚMERO DO WHATSAPP (Altere para seu número)
// ========================================
const WHATSAPP_NUMBER = "5519994053978"; // Formato: 55 + DDD + número (sem caracteres especiais)

voltarBtn.addEventListener("click", function () {
    window.location.href = "../index.html";
});

overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
        overlay.classList.add("hidden");
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const dataReserva = document.getElementById("data").value;
    const horaReserva = document.getElementById("hora").value;
    const pessoasReserva = document.getElementById("pessoas")?.value || "não informado";
    const nomeReserva = document.getElementById("nome")?.value || "Cliente";

    const dataFormatada = new Date(dataReserva).toLocaleDateString('pt-BR');
    const horaFormatada = horaReserva.slice(0, 5);

    dataSpan.textContent = dataFormatada;
    horaSpan.textContent = horaFormatada;

    // ========================================
    // MONTAR MENSAGEM PRÉ-PRONTA
    // ========================================
    const mensagem = `Olá! Gostaria de fazer uma reserva:
📅 Data: ${dataFormatada}
🕐 Hora: ${horaFormatada}
👥 Quantidade de pessoas: ${pessoasReserva}
👤 Nome: ${nomeReserva}

Agradeço a atenção!`;

    // ========================================
    // CODIFICAR MENSAGEM PARA URL
    // ========================================
    const mensagemCodificada = encodeURIComponent(mensagem);

    // ========================================
    // CRIAR LINK DO WHATSAPP
    // ========================================
    const linkWhatsApp = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensagemCodificada}`;

    // Mostrar overlay com mensagem
    form.reset();
    overlay.classList.remove("hidden");

    // ========================================
    // REMOVER BOTÃO ANTERIOR SE EXISTIR
    // ========================================
    const botaoAntigo = document.getElementById("enviarWhatsApp");
    if (botaoAntigo) {
        botaoAntigo.remove();
    }

    // ========================================
    // ADICIONAR BOTÃO DE ENVIO COM ESTILO MELHORADO
    // ========================================
    const botaoEnvio = document.createElement("button");
    botaoEnvio.id = "enviarWhatsApp";
    botaoEnvio.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; margin-right: 8px; vertical-align: middle;">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Enviar via WhatsApp
    `;
botaoEnvio.style.cssText = `
    margin-top: 0px;
    padding: 9px 9px;
    background: linear-gradient(135deg, #25D366 0%, #20BA5A 100%);
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 18px;
    font-weight: 60;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 8px 25px rgba(37, 211, 102, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    letter-spacing: 1px;
    transform: scale(1);
    width: 15%;
    box-sizing: border-box;
    text-transform: uppercase; /* Letras maiúsculas para um efeito mais forte */
    outline: none;
    position: relative;
    overflow: hidden;
`;

    // Efeito hover
    botaoEnvio.addEventListener("mouseenter", () => {
        botaoEnvio.style.transform = "scale(1.05) translateY(-2px)";
        botaoEnvio.style.boxShadow = "0 8px 25px rgba(37, 211, 102, 0.6)";
        botaoEnvio.style.background = "linear-gradient(135deg, #20BA5A 0%, #1a8c47 100%)";
    });

    botaoEnvio.addEventListener("mouseleave", () => {
        botaoEnvio.style.transform = "scale(1) translateY(0)";
        botaoEnvio.style.boxShadow = "0 4px 15px rgba(37, 211, 102, 0.4)";
        botaoEnvio.style.background = "linear-gradient(135deg, #25D366 0%, #20BA5A 100%)";
    });

    // Efeito click
    botaoEnvio.addEventListener("mousedown", () => {
        botaoEnvio.style.transform = "scale(0.98)";
    });

    botaoEnvio.addEventListener("mouseup", () => {
        botaoEnvio.style.transform = "scale(1.05) translateY(-2px)";
    });

    botaoEnvio.addEventListener("click", () => {
        window.open(linkWhatsApp, '_blank');
    });

    // Adicionar novo botão na div
    const container = overlay.querySelector(".mensagem-container");
    if (container) {
        container.appendChild(botaoEnvio);
    } else {
        overlay.appendChild(botaoEnvio);
    }
});