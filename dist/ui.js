const container = document.querySelector("#lista-chamados");
const msgVazio = document.querySelector("#msg-vazio");
export function normalizarClasse(valor) {
    return valor
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-");
}
export function criarCardChamado(chamado) {
    const classePrioridade = normalizarClasse(chamado.prioridade);
    const classeStatus = normalizarClasse(chamado.status);
    const card = document.createElement("li");
    card.className = "card-chamado";
    card.dataset.id = String(chamado.id);
    const topo = document.createElement("div");
    topo.className = "card-chamado__topo";
    const titulo = document.createElement("h3");
    titulo.className = "card-chamado__titulo";
    titulo.textContent = chamado.titulo;
    const badges = document.createElement("div");
    badges.className = "badges";
    const badgePrioridade = document.createElement("span");
    badgePrioridade.className = `badge badge--${classePrioridade}`;
    badgePrioridade.textContent = chamado.prioridade;
    const badgeStatus = document.createElement("span");
    badgeStatus.className = `badge badge--${classeStatus}`;
    badgeStatus.textContent = chamado.status;
    badges.append(badgePrioridade, badgeStatus);
    topo.append(titulo, badges);
    const cliente = document.createElement("p");
    cliente.className = "card-chamado__cliente";
    cliente.setAttribute("name", "clienteNome");
    cliente.textContent = chamado.clienteNome;
    const acoes = document.createElement("div");
    acoes.className = "card-chamado__acoes";
    const botaoEditar = document.createElement("button");
    botaoEditar.className = "btn btn--pequeno btn--fantasma btn-editar";
    botaoEditar.textContent = "Editar";
    const botaoExcluir = document.createElement("button");
    botaoExcluir.className = "btn btn--pequeno btn--perigo btn-excluir";
    botaoExcluir.textContent = "Excluir";
    acoes.append(botaoEditar, botaoExcluir);
    card.append(topo, cliente, acoes);
    return card;
}
// Para cada chamado dentro de chamados, colocar esse HTML.
export function renderizarChamados(listaDeChamados) {
    if (!container || !msgVazio) {
        throw new Error("Elementos essenciais da interface não foram encontrados.");
    }
    if (listaDeChamados.length !== 0) {
        container.hidden = false;
        msgVazio.hidden = true;
        container.replaceChildren(...listaDeChamados.map(criarCardChamado));
    }
    else {
        container.replaceChildren();
        msgVazio.hidden = false;
        container.hidden = true;
    }
}
