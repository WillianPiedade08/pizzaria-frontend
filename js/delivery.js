const API_URL = "https://back-pizzaria-deployed.vercel.app";

const botoesAdicionar = document.querySelectorAll('.btn-adicionar');

botoesAdicionar.forEach(botao => {
    botao.addEventListener('click', () => {
        const nome = botao.dataset.nome;
        const preco = parseFloat(botao.dataset.preco);
        const imagem = botao.dataset.imagem;

        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

        const produtoExistente = carrinho.find(p => p.nome === nome);
        if (produtoExistente) {
            produtoExistente.quantidade += 1;
        } else {
            carrinho.push({
                nome,
                preco,
                imagem,
                quantidade: 1
            });
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        alert(`${nome} adicionado ao carrinho!`);
    });
});


async function cadastrarCliente() {
    try {
        const response = await fetch(`${API_URL}/cliente`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nome: document.getElementById("nome").value,
                telefone: document.getElementById("telefone").value,
                endereco: document.getElementById("endereco").value
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("cliente_id", data.cliente_id);
            localStorage.setItem("token", data.token);
            alert("Cliente cadastrado com sucesso!");
        } else {
            alert("Erro ao cadastrar cliente: " + data.error);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com servidor.");
    }
}


const finalizarPedidoBtn = document.getElementById('finalizarPedido');

if (finalizarPedidoBtn) {
    finalizarPedidoBtn.addEventListener('click', async () => {

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const sub_total = carrinho.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    const cliente_id = localStorage.getItem("cliente_id");
    const token = localStorage.getItem("token");

    if (!cliente_id || !token) {
        alert("Você precisa cadastrar-se antes de finalizar o pedido!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/pedido`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                
                cliente_id: Number(cliente_id),
                sub_total
            })
        });

        const pedido = await response.json();

        if (response.ok) {
            alert("Pedido realizado com sucesso! ID: " + pedido.pedido_id);

            for (const item of carrinho) {
                await fetch(`${API_URL}/pedido_item`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        pedido_id: pedido.pedido_id,
                        nome: item.nome,
                        preco: item.preco,
                        quantidade: item.quantidade
                    })
                });
            }

            localStorage.removeItem("carrinho");
        } else {
            alert("Erro ao finalizar pedido: " + pedido.error);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
    }

});

}