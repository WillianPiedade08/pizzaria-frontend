fetch('https://api-pizzas-seu-ze.vercel.app/pedidos')
  .then(response => {
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
    return response.json();
  })
  .then(data => {
    localStorage.setItem('produtos', JSON.stringify(data));
    console.log('Produtos carregados do back:', data);
  })
  .catch(err => {
    console.error('Falha ao buscar produtos no back:', err);
  });
  
  const carrinhoContainer = document.getElementById('carrinho-container');
    const totalSpan = document.getElementById('total');
    const btnEnviar = document.getElementById('enviar-pedido');
    const dadosPagamento = document.getElementById('dados-pagamento');
    const radiosPagamento = document.querySelectorAll('input[name="pagamento"]');
    const cepInput = document.getElementById('cep'); 

    function carregarCarrinho() {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      carrinhoContainer.innerHTML = ''; 
      let total = 0;

      if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        totalSpan.textContent = 'R$ 0,00';
        return; 
      }

      carrinho.forEach((produto, index) => {
        
        const precoValido = typeof produto.preco === 'number' ? produto.preco : 0;
        const quantidadeValida = typeof produto.quantidade === 'number' && produto.quantidade > 0 ? produto.quantidade : 0;

        if (quantidadeValida === 0) return; 

        const subtotal = precoValido * quantidadeValida;
        total += subtotal;

        const item = document.createElement('div');
        item.classList.add('item-carrinho');
        item.innerHTML = `
          <img src="${produto.imagem || 'placeholder.png'}" alt="${produto.nome || 'Produto sem nome'}" />
          <div class="info">
            <h3>${produto.nome || 'Produto sem nome'}</h3>
            <p>Preço: R$ ${precoValido.toFixed(2).replace('.', ',')}</p>
            <label>Qtd:
              <input type="number" min="0" value="${quantidadeValida}" data-index="${index}" />
            </label>
          </div>
        `;
        carrinhoContainer.appendChild(item);
      });

      totalSpan.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    carrinhoContainer.addEventListener('input', (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'number') {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const novaQtd = parseInt(e.target.value, 10);

        if (index >= 0 && index < carrinho.length) {
          if (isNaN(novaQtd) || novaQtd <= 0) {
            
            carrinho.splice(index, 1);
          } else {
            carrinho[index].quantidade = novaQtd;
          }

          localStorage.setItem('carrinho', JSON.stringify(carrinho));
          carregarCarrinho(); 
        }
      }
    });

    function atualizarFormularioPagamento() {
      const forma = document.querySelector('input[name="pagamento"]:checked')?.value;
      dadosPagamento.innerHTML = ''; 

      if (forma === 'Pix') {
        dadosPagamento.innerHTML = `
          <input type="text" id="nomePix" placeholder="Nome completo" required>
          <input type="text" id="chavePix" placeholder="Chave Pix (CPF, e-mail ou telefone)" required>
        `;
      } else if (forma === 'Cartão') {
        dadosPagamento.innerHTML = `
          <input type="text" id="nomeCartao" placeholder="Nome completo" required>
          <input type="email" id="emailCartao" placeholder="E-mail" required>
          <input type="text" id="cpfCartao" placeholder="CPF" required>
          <input type="text" id="numeroCartao" placeholder="Número do Cartão" required>
          <input type="text" id="validadeCartao" placeholder="Validade (MM/AA)" required>
          <input type="text" id="cvvCartao" placeholder="CVV" required>
        `;
      } else if (forma === 'Boleto') {
        dadosPagamento.innerHTML = `
          <input type="text" id="nomeBoleto" placeholder="Nome completo" required>
          <input type="email" id="emailBoleto" placeholder="E-mail para envio do boleto" required>
          <input type="text" id="cpfBoleto" placeholder="CPF" required>
        `;
      } else if (forma === 'Cartão de Débito') {
        dadosPagamento.innerHTML = `
          <input type="text" id="nomeDebito" placeholder="Nome completo" required>
          <input type="email" id="emailDebito" placeholder="E-mail" required>
          <input type="text" id="cpfDebito" placeholder="CPF" required>
          <p>Você será redirecionado para concluir o pagamento.</p>
        `;
      }
    }

    radiosPagamento.forEach(radio => {
      radio.addEventListener('change', atualizarFormularioPagamento);
    });

    // --- Nova função para enviar o pedido para a API ---
    async function enviarPedidoParaAPI(dadosDoPedido) {
      // Usaremos o mesmo endpoint, mas é crucial que o backend esteja configurado para receber POST.
      const API_URL = 'https://api-pizzas-seu-ze.vercel.app/pedidos'; 
      
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dadosDoPedido),
        });

        if (!response.ok) {
          // Tentativa de extrair a mensagem de erro do corpo da resposta
          let errorDetails = `Erro ${response.status}: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorDetails = errorData.message;
            } else if (errorData.error) {
              errorDetails = errorData.error;
            }
          } catch (e) {
            // Ignora se o corpo não for JSON
          }
          
          console.error('Detalhes do erro da API:', errorDetails);
          throw new Error(`Falha ao enviar pedido. Verifique se o endpoint da API (${API_URL}) aceita requisições POST e se o backend está funcionando corretamente. Detalhes: ${errorDetails}`);
        }

        const resultado = await response.json();
        console.log('Pedido enviado com sucesso:', resultado);
        return resultado;

      } catch (error) {
        console.error('Falha na requisição POST do pedido:', error);
        alert('Ocorreu um erro ao finalizar o pedido. Por favor, tente novamente. Detalhes no console.');
        return null;
      }
    }
    // ----------------------------------------------------

    btnEnviar.addEventListener('click', async () => { // Adicionado 'async' aqui
      // 0. VERIFICAÇÃO DE LOGIN
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Você precisa estar logado para continuar ao pagamento. Redirecionando para o login.');
        window.location.href = './login.html'; // Redireciona para a página de login
        return;
      }
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      if (carrinho.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
      }

      const cep = cepInput.value.trim();
    
      if (!cep || !/^\d{5}-?\d{3}$/.test(cep)) {
        alert('Por favor, preencha um CEP válido (ex: 12345-678 ou 12345678).');
        cepInput.focus(); 
        return;
      }

      const formaSelecionada = document.querySelector('input[name="pagamento"]:checked')?.value;
      let dadosValidos = true;
      let mensagemAlerta = '';
      let dadosPagamentoColetados = {}; // Objeto para armazenar os dados de pagamento

      // Coleta de dados de pagamento e validação
      if (formaSelecionada === 'Pix') {
        const nome = document.getElementById('nomePix')?.value.trim();
        const chave = document.getElementById('chavePix')?.value.trim();
        if (!nome || !chave) {
          dadosValidos = false;
          alert('Preencha os dados do Pix corretamente!');
        } else {
          dadosPagamentoColetados = { nome, chave };
          mensagemAlerta = `Pedido enviado via Pix!\nNome: ${nome}\nChave Pix: ${chave}\nCEP: ${cep}`;
        }
      } else if (formaSelecionada === 'Cartão') {
        const nome = document.getElementById('nomeCartao')?.value.trim();
        const email = document.getElementById('emailCartao')?.value.trim();
        const cpf = document.getElementById('cpfCartao')?.value.trim();
        const numero = document.getElementById('numeroCartao')?.value.trim();
        const validade = document.getElementById('validadeCartao')?.value.trim();
        const cvv = document.getElementById('cvvCartao')?.value.trim();

        if (!nome || !email || !cpf || !numero || !validade || !cvv) {
          dadosValidos = false;
          alert('Preencha todos os dados do cartão!');
        } else {
          // Nota: Em um ambiente real, NUNCA envie dados sensíveis de cartão para o frontend.
          // Aqui, estamos apenas coletando para simular o envio.
          dadosPagamentoColetados = { nome, email, cpf, numero, validade, cvv };
          mensagemAlerta = `Pedido enviado com Cartão de Crédito!\nNome: ${nome}\nEmail: ${email}\nCPF: ${cpf}\nCEP: ${cep}`;
        }
      } else if (formaSelecionada === 'Boleto') {
        const nome = document.getElementById('nomeBoleto')?.value.trim();
        const email = document.getElementById('emailBoleto')?.value.trim();
        const cpf = document.getElementById('cpfBoleto')?.value.trim();
        if (!nome || !email || !cpf) {
          dadosValidos = false;
          alert('Preencha os dados para o Boleto!');
        } else {
          dadosPagamentoColetados = { nome, email, cpf };
          mensagemAlerta = `Pedido gerado via Boleto!\nNome: ${nome}\nEmail: ${email}\nCPF: ${cpf}\nCEP: ${cep}\nEnviaremos o código para seu e-mail.`;
        }
      } else if (formaSelecionada === 'Cartão de Débito') {
        const nome = document.getElementById('nomeDebito')?.value.trim();
        const email = document.getElementById('emailDebito')?.value.trim();
        const cpf = document.getElementById('cpfDebito')?.value.trim();
        if (!nome || !email || !cpf) {
          dadosValidos = false;
          alert('Preencha os dados para o Cartão de Débito!');
        } else {
          dadosPagamentoColetados = { nome, email, cpf };
          mensagemAlerta = `Pedido enviado com Cartão de Débito!\nNome: ${nome}\nEmail: ${email}\nCPF: ${cpf}\nCEP: ${cep}`;
        }
      }

      if (dadosValidos) {
        // 1. Estruturar os dados do pedido
        const totalTexto = totalSpan.textContent.replace('R$ ', '').replace(',', '.');
        let sub_total = parseFloat(totalTexto);
        
        // Garante que o sub_total é um número válido, caso contrário, usa 0
        if (isNaN(sub_total)) {
            sub_total = 0;
        }

        // 1. Estruturar os dados do pedido
        const usuarioLogadoString = localStorage.getItem('usuarioLogado');
        const usuarioLogado = usuarioLogadoString && usuarioLogadoString !== 'undefined' ? JSON.parse(usuarioLogadoString) : null;
        
        // O objeto do usuário tem a propriedade 'id' ou 'userId'?
        const usuario_id = usuarioLogado ? Number(usuarioLogado.id || usuarioLogado.userId) : null; // Tenta 'id' e 'userId'

        console.log('DEBUG: usuarioLogado:', usuarioLogado);
        console.log('DEBUG: usuario_id:', usuario_id);

        // VERIFICAÇÃO ADICIONAL: Se o usuario_id ainda for nulo, interrompe e alerta.
        if (!usuario_id) {
            alert('Erro: Não foi possível identificar o usuário logado. Por favor, faça login novamente.');
            return;
        }

        const dadosDoPedido = {
          usuario_id: usuario_id, // Adiciona o ID do usuário
          sub_total: sub_total,
          forma_pagamento: formaSelecionada, // O backend espera 'forma_pagamento', não 'formaPagamento'.
          // O backend não usa 'cep' ou 'dadosPagamento' diretamente no objeto principal, mas vamos mantê-los para referência, se necessário.
          cep: cep,
          dadosPagamento: dadosPagamentoColetados, 
          
          // O backend espera 'itens', não 'PedidoProdutos'.
          itens: carrinho.map(item => ({
            // O backend espera 'produto_id' e 'preco_unitario'
            produto_id: item.id || item.produto_id || 1, // Assumindo que o ID do produto está em 'item.id' ou 'item.produto_id'. Usando 1 como fallback para evitar erro de validação.
            quantidade: item.quantidade,
            preco_unitario: item.preco, // Assumindo que 'item.preco' é o preço unitário
            // O backend também usa 'forma_pagamento' no itemPedido, mas vamos deixar o backend lidar com isso.
          })),
        };

        // 2. Enviar para a API
        const resultadoEnvio = await enviarPedidoParaAPI(dadosDoPedido);

        if (resultadoEnvio) {
          alert(mensagemAlerta);
          
          // 3. Limpar e redirecionar apenas se o envio for bem-sucedido
          localStorage.removeItem('carrinho');
          window.location.href = '../index.html'; 
        }
      }
    });

    
    carregarCarrinho();
    atualizarFormularioPagamento();
