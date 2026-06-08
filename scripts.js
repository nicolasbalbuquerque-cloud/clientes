// ==========================================================================
// CONFIGURAÇÃO REMOTA (LEIA ATENTAMENTE A REGRA DE EXPINRAÇÃO DO CRUDCRUD)
// ==========================================================================
// SUBISTITUA o hash abaixo pelo gerado na página inicial do seu crudcrud.com
const API_BASE_URL = "https://crudcrud.com/api/9dbd133091294a22b39448637b613a61/clientes";

// Elementos manipulados da interface
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const btnSalvar = document.getElementById("btn-salvar");
const listaClientes = document.getElementById("lista-clientes");
const msgListaVazia = document.getElementById("lista-vazia");
const loader = document.getElementById("loader");
const ledStatus = document.getElementById("api-status");

// ==========================================================================
// 1. MÉTODO GET - LISTAR CLIENTES DO SERVIDOR
// ==========================================================================
async function listarClientes() {
    exibirCarregamento(true);
    
    try {
        const resposta = await fetch(API_BASE_URL);
        if (!resposta.ok) throw new Error("Falha ao consultar banco remoto.");
        
        const clientes = await resposta.json();
        
        // Limpa visualizações prévias
        listaClientes.innerHTML = "";
        ledStatus.classList.remove("erro");

        if (clientes.length === 0) {
            msgListaVazia.classList.remove("oculto");
        } else {
            msgListaVazia.classList.add("oculto");
            // Mapeia e renderiza cada cliente retornado da API
            clientes.forEach(cliente => renderizarClienteNaTela(cliente));
        }
    } catch (erro) {
        console.error("Erro na requisição GET:", erro);
        ledStatus.classList.add("erro");
    } finally {
        exibirCarregamento(false);
    }
}

// ==========================================================================
// 2. MÉTODO POST - CADASTRAR NOVO CLIENTE
// ==========================================================================
async function cadastrarCliente() {
    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();

    // Validação básica interna de preenchimento
    if (!nome || !email) {
        alert("Por favor, preencha todos os campos antes de salvar.");
        return;
    }

    const novoCliente = { nome, email };

    exibirCarregamento(true);

    try {
        // Envio do pacote de dados usando os cabeçalhos apropriados
        const resposta = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(novoCliente)
        });

        if (!resposta.ok) throw new Error("Erro ao salvar dados.");

        // Limpa os campos do formulário após sucesso
        inputNome.value = "";
        inputEmail.value = "";

        // Atualiza a listagem automaticamente trazendo os dados novos
        await listarClientes();

    } catch (erro) {
        console.error("Erro na requisição POST:", erro);
        alert("Ocorreu um erro ao tentar salvar o cliente.");
    } finally {
        exibirCarregamento(false);
    }
}

// ==========================================================================
// 3. MÉTODO DELETE - EXCLUIR CLIENTE DO BANCO REMOTO
// ==========================================================================
async function excluirCliente(id) {
    if (!confirm("Tem certeza que deseja remover este cliente permanentemente?")) {
        return;
    }

    exibirCarregamento(true);
    
    // Concatena o ID único do objeto gerado pelo CrudCrud na URL da chamada
    const urlExclusao = `${API_BASE_URL}/${id}`;

    try {
        const resposta = await fetch(urlExclusao, {
            method: "DELETE"
        });

        if (!resposta.ok) throw new Error("Erro ao tentar deletar o registro.");

        // Recarrega a fila atualizada após deleção bem-sucedida
        await listarClientes();

    } catch (erro) {
        console.error("Erro na requisição DELETE:", erro);
        alert("Não foi possível excluir este cliente do servidor.");
    } finally {
        exibirCarregamento(false);
    }
}

// ==========================================================================
// FUNÇÕES AUXILIARES DE SUPORTE
// ==========================================================================

function renderizarClienteNaTela(cliente) {
    const li = document.createElement("li");
    li.className = "cliente-item";
    
    // CrudCrud gera o atributo identificador único como '_id'
    li.innerHTML = `
        <div class="cliente-info">
            <strong>${cliente.nome}</strong>
            <span>${cliente.email}</span>
        </div>
        <button class="btn-excluir" onclick="excluirCliente('${cliente._id}')">Remover</button>
    `;
    
    listaClientes.appendChild(li);
}

function exibirCarregamento(carregando) {
    if (carregando) {
        loader.classList.remove("oculto");
        btnSalvar.disabled = true;
    } else {
        loader.classList.add("oculto");
        btnSalvar.disabled = false;
    }
}

// Assinatura e gatilhos de inicialização
btnSalvar.addEventListener("click", cadastrarCliente);
window.addEventListener("DOMContentLoaded", listarClientes);