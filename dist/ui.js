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
    return `<li class="card-chamado" data-id="${chamado.id}">
    <div class="card-chamado__topo">
      <h3 class="card-chamado__titulo">${chamado.titulo}</h3>
      <div class="badges">
        <span class="badge badge--${classePrioridade}">${chamado.prioridade}</span>
        <span class="badge badge--${classeStatus}">${chamado.status}</span>
      </div>
    </div>
    <p class="card-chamado__cliente" name="clienteNome">${chamado.clienteNome}</p>
    <div class="card-chamado__acoes">
      <button class="btn btn--pequeno btn--fantasma btn-editar">Editar</button>
      <button class="btn btn--pequeno btn--sucesso btn-concluir">
        Concluir
      </button>
      <button class="btn btn--pequeno btn--perigo btn-excluir">Excluir</button>
    </div>
  </li>`;
}
// Para cada chamado dentro de chamados, colocar esse HTML.
export function renderizarChamados(listaDeChamados) {
    if (listaDeChamados.length !== 0) {
        container.hidden = false;
        msgVazio.hidden = true;
        container.innerHTML = listaDeChamados.map(criarCardChamado).join("");
    }
    else {
        container.innerHTML = "";
        msgVazio.hidden = false;
        container.hidden = true;
    }
}
