const API_URL = "https://api-pizzas-seu-ze.vercel.app/produtos";

async function carregarProdutos() {
    try {
        const res = await fetch(API_URL); // rota REAL
        const produtos = await res.json();

        console.log("Produtos recebidos:", produtos); // DEBUG

        const listaSalgados = document.getElementById("lista-produtos-salgados");
        const listaDoces = document.getElementById("lista-produtos-doces");

        listaSalgados.innerHTML = "";
        listaDoces.innerHTML = "";

        produtos.forEach(produto => {

            // ===== CAMPOS CORRETOS =====
            const id = produto.produto_id; 
            const nome = produto.nome;
            const preco = Number(produto.preco);
            const descricao = produto.descricao;

            // Imagem — com fallback
            const imagem = produto.imagem && produto.imagem !== "null" && produto.imagem !== ""
                ? produto.imagem
                : "../img/sem-foto.png";

            const card = `
                <article class="product">
                    <h2>${nome}</h2>
                    <img src="${imagem}" alt="${nome}">
                    <p>${descricao || ""}</p>
                    <span>R$ ${preco.toFixed(2)}</span>

                    <button class="btn-adicionar"
                        data-id="${id}"
                        data-nome="${nome}"
                        data-preco="${preco}"
                        data-imagem="${imagem}">
                        Adicionar ao Carrinho
                    </button>
                </article>
            `;

            // ===== Separar salgadas e doces =====  
            if (id <= 18) {
                listaSalgados.innerHTML += card;
            } else {
                listaDoces.innerHTML += card;
            }
        });

        adicionarEventosCarrinho();

    } catch (error) {
        console.error("Erro ao carregar produtos:", error);
    }
}

function adicionarEventosCarrinho() {
    const botoes = document.querySelectorAll(".btn-adicionar");

    botoes.forEach(btn => {
        btn.onclick = () => {

            const produto = {
                id: btn.dataset.id,
                nome: btn.dataset.nome,
                preco: Number(btn.dataset.preco),
                imagem: btn.dataset.imagem,
                quantidade: 1
            };

            let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

            const existente = carrinho.find(p => p.id == produto.id);

            if (existente) existente.quantidade++;
            else carrinho.push(produto);

            localStorage.setItem("carrinho", JSON.stringify(carrinho));

            alert(`${produto.nome} adicionado ao carrinho!`);
        };
    });
}

carregarProdutos();
