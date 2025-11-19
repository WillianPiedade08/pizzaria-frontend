fetch('https://back-pizzaria-deployed.vercel.app/pedidos')
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

    btnEnviar.addEventListener('click', () => {
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

      if (formaSelecionada === 'Pix') {
        const nome = document.getElementById('nomePix')?.value.trim();
        const chave = document.getElementById('chavePix')?.value.trim();
        if (!nome || !chave) {
          dadosValidos = false;
          alert('Preencha os dados do Pix corretamente!');
        } else {
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
          mensagemAlerta = `Pedido enviado com Cartão de Débito!\nNome: ${nome}\nEmail: ${email}\nCPF: ${cpf}\nCEP: ${cep}`;
        }
      }

      if (dadosValidos) {
        alert(mensagemAlerta);
       
        console.log('Dados do pedido:', {
          carrinho: carrinho,
          cep: cep,
          formaPagamento: formaSelecionada,
          
        });

        localStorage.removeItem('carrinho');
        window.location.href = '/index.html'; 
      }
    });

    
    carregarCarrinho();
    atualizarFormularioPagamento();