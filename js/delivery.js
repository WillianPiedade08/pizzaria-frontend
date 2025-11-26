async function carregarProdutos() {
    try {
        const resposta = await fetch("https://api-pizzas-seu-ze.vercel.app/produtos");
        const produtos = await resposta.json();

        const lista = document.getElementById("lista-produtos");
        lista.innerHTML = "";

        produtos.forEach(produto => {

            const id = produto.produto_id; // ID do produto para o carrinho
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
                    id: id, // ID original do produto (para envio à API)
                    nome,
                    preco,
                    imagem,
                    quantidade: 1,
                    chaveUnica: `${id}-${nome}` // Chave única para identificação no carrinho
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

    // A comparação deve ser estrita (===) se os IDs forem do mesmo tipo (number ou string)
    // Se a API retorna o ID como string e o JS como number, '==' funciona, mas '===' é mais seguro.
    // Vamos manter '==' por enquanto, mas garantir que o ID do produto seja o 'produto_id' da API.
    // A chave de identificação única é a combinação do ID do produto e do nome.
    // Isso contorna o problema de IDs duplicados vindos da API.
    const chaveUnica = `${produto.id}-${produto.nome}`;
    const existente = carrinho.find(p => p.chaveUnica === chaveUnica);

    if (existente) {
        existente.quantidade++;
    } else {
        carrinho.push(produto);
    }

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    alert(`${produto.nome} foi adicionado ao carrinho!`);
}

carregarProdutos();
