// ...existing code...
document.addEventListener('DOMContentLoaded', () => {
    const API_URL = "https://api-pizzas-seu-ze.vercel.app";

    const form = document.querySelector('form');
    const tableBody = document.querySelector('#clientesTable tbody');

    async function fetchClientes() {
        if (!tableBody) return;
        try {
            const res = await fetch(`${API_URL}/usuarios`);
            if (!res.ok) throw new Error('Erro ao buscar usuarios: ' + res.statusText);
            const usuarios = await res.json();
            tableBody.innerHTML = '';
            usuarios.forEach(usuario => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td data-label="Nome">${usuario.nome}</td>
                    <td data-label="Email">${usuario.email}</td>
                `;
                tableBody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
        }
    }
});
// ...existing code...