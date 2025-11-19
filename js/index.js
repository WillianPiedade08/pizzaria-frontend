const URL_API = "https://back-pizzaria-deployed.vercel.app";

const form = document.getElementById('clienteForm');
const tableBody = document.querySelector('#clientesTable tbody');

async function fetchClientes() {
  const res = await fetch(`${API_URL}/clientes`); 
  const clientes = await res.json();
  tableBody.innerHTML = '';
  clientes.forEach(cliente => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Nome">${cliente.nome}</td>
      <td data-label="Email">${cliente.email}</td>
      <td data-label="Ações">
        <button onclick="editarCliente(${cliente.id})">Editar</button>
        <button onclick="excluirCliente(${cliente.id})">Excluir</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  await fetch(`${API_URL}/clientes/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email })
  });

  form.reset();
  fetchClientes();
});

async function excluirCliente(id) {
  await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
  fetchClientes();
}

function editarCliente(id) {

  alert('Função editar ainda não implementada');
}

fetchClientes();