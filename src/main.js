import { chamados } from "../data/chamados.js";

let chamadosAtuais = [];

const container = document.querySelector("#lista-chamados");
const msgVazio = document.querySelector("#msg-vazio");
const botaoNovoChamado = document.querySelector("#btn-novo-chamado");
const viewFormularioNovoChamado = document.querySelector("#view-form-chamado");
const viewChamados = document.querySelector("#view-chamados");
const botaoCancelar = document.querySelector("#btn-cancelar-form");
const formChamado = document.querySelector("#form-chamado");
const busca = document.querySelector("#busca");
const filtroStatus = document.querySelector("#filtro-status");
const filtroPrioridade = document.querySelector("#filtro-prioridade");
const filtroOrdenacao = document.querySelector("#ordenacao");
const mensagemCarregando = document.querySelector("#msg-carregando");
const mensagemErro = document.querySelector("#msg-erro")
let idEmEdicao = null;

function normalizarClasse(valor) {
  return valor
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

function criarCardChamado(chamado) {
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
function renderizarChamados(listaDeChamados) {
  if (listaDeChamados.length !== 0) {
    container.hidden = false;
    msgVazio.hidden = true;
    container.innerHTML = listaDeChamados.map(criarCardChamado).join("");
  } else {
    container.innerHTML = "";
    msgVazio.hidden = false;
    container.hidden = true;
  }
}


// BOTÃO CRIAR NOVO CHAMADO
botaoNovoChamado.addEventListener("click", () => {
  viewChamados.hidden = true;
  viewFormularioNovoChamado.hidden = false;
  idEmEdicao = null;
  formChamado.reset();
});

// BOTÃO ENVIAR FORM: EDIÇÃO/NOVO
formChamado.addEventListener("submit", function (event) {
  event.preventDefault();
  const dadosForm = Object.fromEntries(new FormData(formChamado));
  if (idEmEdicao !== null) {
    chamadosAtuais = chamadosAtuais.map((chamado) => {
      if (chamado.id === idEmEdicao) {
        return {
          ...chamado,
          ...dadosForm,
        };
      }

      return chamado;
    });
  } else {
    let proximoId = 0;
    if (chamadosAtuais.length !== 0) {
      proximoId = Math.max(...chamadosAtuais.map((chamado) => chamado.id)) + 1;
    } else {
      proximoId = 1;
    }

    const novoChamado = {
      ...dadosForm,
      id: proximoId,
      dataAbertura: new Date().toISOString().slice(0, 10),
    };

    chamadosAtuais = [...chamadosAtuais, novoChamado];
  }

  salvarChamados();
  renderizarChamados(chamadosAtuais);
  viewChamados.hidden = false;
  viewFormularioNovoChamado.hidden = true;
  formChamado.reset();
  idEmEdicao = null;
});

// BOTÃO EXCLUIR
container.addEventListener("click", (event) => {
  if (!event.target.classList.contains("btn-excluir")) {
    return;
  }

  const card = event.target.closest(".card-chamado");
  const id = Number(card.dataset.id);

  chamadosAtuais = chamadosAtuais.filter((chamado) => chamado.id !== id);
  salvarChamados();
  renderizarChamados(chamadosAtuais);
});

// BOTÃO EDITAR
container.addEventListener("click", (event) => {
  if (!event.target.classList.contains("btn-editar")) {
    return;
  }

  const card = event.target.closest(".card-chamado");
  const id = Number(card.dataset.id);

  const chamado = chamadosAtuais.find((chamado) => chamado.id === id);
  idEmEdicao = chamado.id;

  formChamado.elements.titulo.value = chamado.titulo;
  formChamado.elements.clienteNome.value = chamado.clienteNome;
  formChamado.elements.prioridade.value = chamado.prioridade;
  formChamado.elements.status.value = chamado.status;
  viewChamados.hidden = true;
  viewFormularioNovoChamado.hidden = false;
});

// BOTÃO CANCELAR
botaoCancelar.addEventListener("click", () => {
  idEmEdicao = null;
  formChamado.reset();
  viewChamados.hidden = false;
  viewFormularioNovoChamado.hidden = true;
});

// PESQUISA
busca.addEventListener("input", aplicarFiltros);

function aplicarFiltros() {
  const termo = busca.value.toLowerCase();
  const statusSelecionado = filtroStatus.value;
  const prioridadeSelecionada = filtroPrioridade.value;
  const ordenacaoSelecionada = filtroOrdenacao.value;

  const chamadosFiltrados = chamadosAtuais.filter((chamado) => {
    const correspondeStatus =
      statusSelecionado === "" || chamado.status === statusSelecionado;
    const correspondePesquisa =
      chamado.titulo.toLowerCase().includes(termo) ||
      chamado.clienteNome.toLowerCase().includes(termo);
    const correspondePrioridade =
      prioridadeSelecionada === "" ||
      chamado.prioridade === prioridadeSelecionada;
    return correspondePesquisa && correspondeStatus && correspondePrioridade;
  });

  const chamadosOrdenados = [...chamadosFiltrados];

  chamadosOrdenados.sort((a, b) => {
    const data1 = new Date(a.dataAbertura);
    const data2 = new Date(b.dataAbertura);

    if (ordenacaoSelecionada === "recentes") {
      return data2 - data1;
    } else if (ordenacaoSelecionada === "antigos") {
      return data1 - data2;
    } else if (ordenacaoSelecionada === "prioridade") {
      const pesoPrioridade = {
        Urgente: 4,
        Alta: 3,
        Media: 2,
        Baixa: 1,
      };
      return pesoPrioridade[b.prioridade] - pesoPrioridade[a.prioridade];
    }
  });

  renderizarChamados(chamadosOrdenados);
}

// Filtro Status
filtroStatus.addEventListener("change", aplicarFiltros);

// Filtro Prioridade
filtroPrioridade.addEventListener("change", aplicarFiltros);

// Filtro Ordenação
filtroOrdenacao.addEventListener("change", aplicarFiltros);

function salvarChamados() {
  const chamadosEmJSON = JSON.stringify(chamadosAtuais);
  localStorage.setItem("chamados", chamadosEmJSON);
}

function carregarChamados() {
  const chamadosSalvos = localStorage.getItem("chamados");

  if (chamadosSalvos) {
    return JSON.parse(chamadosSalvos);
  }
  return [...chamados];
}

function carregarChamadosAsync() {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      const dados = carregarChamados();

      resolve(dados);
    }, 1000);
  });
}

async function iniciarAplicacao() {
  mensagemCarregando.hidden = false;
  mensagemErro.hidden = true;

  try {
    const dados = await carregarChamadosAsync();
    chamadosAtuais = dados;
    renderizarChamados(chamadosAtuais);
  } catch (error) {
    console.log(error);
    mensagemErro.hidden = false;
  } finally {
    mensagemCarregando.hidden = true;
  }
}
iniciarAplicacao();
