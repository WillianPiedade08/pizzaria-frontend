async function carregarProdutos() {
    try {
        const resposta = await fetch("https://api-pizzas-seu-ze.vercel.app/produtos");
        const produtos = await resposta.json();

        const lista = document.getElementById("lista-produtos");
        lista.innerHTML = "";

        produtos.forEach(produto => {

            const id = produto.produto_id;
            const nome = produto.nome || "Sem nome";
            const descricao = produto.descricao || "";
            const preco = Number(produto.preco) || 0;
            const imagem = produto.imagem || "../img/sem-foto.png";

            const card = document.createElement("article");
            card.classList.add("product");

            card.innerHTML = `
                <img src="${imagem}" alt="${nome}">

                <h2>${nome}</h2>

                <p class="descricao">
                    ${descricao}
                </p>

                <span class="preco">
                    R$ ${preco.toFixed(2).replace(".", ",")}
                </span>

                <button class="btn-adicionar">
                    Adicionar ao carrinho
                </button>
            `;

            // Evento do botão
            card.querySelector(".btn-adicionar").onclick = () => {
                adicionarAoCarrinho({
                    id,
                    nome,
                    preco,
                    imagem,
                    quantidade: 1
                });
            };

            lista.appendChild(card);
        });

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

function adicionarAoCarrinho(produto) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

    const existente = carrinho.find(p => p.id == produto.id);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push(produto);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    alert(`${produto.nome} foi adicionado ao carrinho!`);
}

carregarProdutos();
