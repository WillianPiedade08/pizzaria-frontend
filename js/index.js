// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = "https://api-pizzas-seu-ze.vercel.app";

    const form = document.querySelector('form');
    const tableBody = document.querySelector('#clientesTable tbody');

    async function fetchClientes() {
        if (!tableBody) return;
        try {
            const res = await fetch(`${API_URL}/clientes`);
            if (!res.ok) throw new Error('Erro ao buscar clientes: ' + res.statusText);
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
        } catch (err) {
            console.error(err);
        }
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome')?.value;
            const email = document.getElementById('email')?.value;

            try {
                await fetch(`${API_URL}/clientes/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nome, email })
                });
                form.reset();
                fetchClientes();
            } catch (err) {
                console.error(err);
            }
        });
    }

    async function excluirCliente(id) {
        try {
            await fetch(`${API_URL}/clientes/${id}`, { method: 'DELETE' });
            fetchClientes();
        } catch (err) {
            console.error(err);
        }
    }

    window.editarCliente = function(id) {
        alert('Função editar ainda não implementada');
    };

    fetchClientes();
});
// ...existing code...