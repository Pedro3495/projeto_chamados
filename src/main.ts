import { aplicarFiltros } from "./filtros.js";
import { ehPrioridade, ehStatus } from "./data/chamados.js";
import {
  atualizarChamado,
  criarChamado,
  excluirChamado,
} from "./regrasChamados.js";
import { carregarChamadosAsync, salvarChamados } from "./storage.js";
import { renderizarChamados } from "./ui.js";
import type { Chamado } from "./data/chamados.js";
import type { Ordenacao } from "./filtros.js";

let chamadosAtuais: Chamado[] = [];
let idEmEdicao: number | null = null;

const container = document.querySelector<HTMLUListElement>("#lista-chamados");
const botaoNovoChamado =
  document.querySelector<HTMLButtonElement>("#btn-novo-chamado");
const viewFormularioNovoChamado =
  document.querySelector<HTMLElement>("#view-form-chamado");
const viewChamados = document.querySelector<HTMLElement>("#view-chamados");
const botaoCancelar =
  document.querySelector<HTMLButtonElement>("#btn-cancelar-form");
const formChamado = document.querySelector<HTMLFormElement>("#form-chamado");
const busca = document.querySelector<HTMLInputElement>("#busca");
const filtroStatus =
  document.querySelector<HTMLSelectElement>("#filtro-status");
const filtroPrioridade =
  document.querySelector<HTMLSelectElement>("#filtro-prioridade");
const filtroOrdenacao = document.querySelector<HTMLSelectElement>("#ordenacao");
const mensagemCarregando =
  document.querySelector<HTMLParagraphElement>("#msg-carregando");
const mensagemErro = document.querySelector<HTMLParagraphElement>("#msg-erro");

if (
  !botaoNovoChamado ||
  !viewChamados ||
  !viewFormularioNovoChamado ||
  !formChamado ||
  !container ||
  !botaoCancelar
) {
  throw new Error("Elementos essenciais da interface não foram encontrados.");
}

function ehOrdenacao(valor: string): valor is Ordenacao {
  return valor === "recentes" || valor === "antigos" || valor === "prioridade";
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

  const formData = new FormData(formChamado);
  const titulo = formData.get("titulo");
  const clienteNome = formData.get("clienteNome");
  const prioridade = formData.get("prioridade");
  const status = formData.get("status");

  if (
    typeof titulo !== "string" ||
    typeof clienteNome !== "string" ||
    typeof prioridade !== "string" ||
    typeof status !== "string"
  ) {
    throw new Error("Dados do formulário inválidos.");
  }

  if (!ehPrioridade(prioridade)) {
    throw new Error("Prioridade inválida.");
  }

  if (!ehStatus(status)) {
    throw new Error("Status inválido.");
  }

  const dadosForm = {
    titulo,
    clienteNome,
    prioridade,
    status,
  };

  if (idEmEdicao !== null) {
    chamadosAtuais = atualizarChamado(chamadosAtuais, idEmEdicao, dadosForm);
  } else {
    chamadosAtuais = criarChamado(
      chamadosAtuais,
      dadosForm,
      new Date().toISOString().slice(0, 10),
    );
  }

  salvarChamados(chamadosAtuais);
  atualizarLista();
  viewChamados.hidden = false;
  viewFormularioNovoChamado.hidden = true;
  formChamado.reset();
  idEmEdicao = null;
});

// BOTÃO EXCLUIR
container.addEventListener("click", (event) => {
  const alvo = event.target;

  if (!(alvo instanceof Element)) {
    return;
  }
  if (!alvo.classList.contains("btn-excluir")) {
    return;
  }

  const card = alvo.closest(".card-chamado");

  if (!(card instanceof HTMLElement)) {
    return;
  }

  const id = Number(card.dataset.id);

  chamadosAtuais = excluirChamado(chamadosAtuais, id);
  salvarChamados(chamadosAtuais);
  atualizarLista();
});

// BOTÃO EDITAR
container.addEventListener("click", (event) => {
  const alvo = event.target;

  if (!(alvo instanceof Element)) {
    return;
  }
  if (!alvo.classList.contains("btn-editar")) {
    return;
  }

  const card = alvo.closest(".card-chamado");

  if (!(card instanceof HTMLElement)) {
    return;
  }

  const id = Number(card.dataset.id);
  const chamado = chamadosAtuais.find((chamado) => chamado.id === id);

  if (!chamado) {
    return;
  }

  idEmEdicao = chamado.id;

  const campoTitulo = formChamado.elements.namedItem("titulo");
  const campoCliente = formChamado.elements.namedItem("clienteNome");
  const campoPrioridade = formChamado.elements.namedItem("prioridade");
  const campoStatus = formChamado.elements.namedItem("status");
  if (
    !(campoTitulo instanceof HTMLInputElement) ||
    !(campoCliente instanceof HTMLInputElement) ||
    !(campoPrioridade instanceof HTMLSelectElement) ||
    !(campoStatus instanceof HTMLSelectElement)
  ) {
    throw new Error("Campos do formulário não foram encontrados.");
  }
  campoTitulo.value = chamado.titulo;
  campoCliente.value = chamado.clienteNome;
  campoPrioridade.value = chamado.prioridade;
  campoStatus.value = chamado.status;

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

function atualizarLista() {
  if (!filtroStatus || !filtroPrioridade || !filtroOrdenacao || !busca) {
    return;
  }

  const termo = busca.value.toLowerCase();
  const statusSelecionado = filtroStatus.value;
  const prioridadeSelecionada = filtroPrioridade.value;
  const ordenacaoSelecionada = filtroOrdenacao.value;

  if (statusSelecionado !== "" && !ehStatus(statusSelecionado)) {
    throw new Error("Filtro de status inválido.");
  }

  if (prioridadeSelecionada !== "" && !ehPrioridade(prioridadeSelecionada)) {
    throw new Error("Filtro de prioridade inválido.");
  }

  if (!ehOrdenacao(ordenacaoSelecionada)) {
    throw new Error("Ordenação inválida.");
  }

  const resultado = aplicarFiltros(
    chamadosAtuais,
    termo,
    statusSelecionado,
    prioridadeSelecionada,
    ordenacaoSelecionada,
  );
  renderizarChamados(resultado);
}

if (!busca || !filtroStatus || !filtroPrioridade || !filtroOrdenacao) {
  throw new Error("Controles de pesquisa e filtros não foram encontrados.");
}

// PESQUISA
busca.addEventListener("input", atualizarLista);

// Filtro Status
filtroStatus.addEventListener("change", atualizarLista);

// Filtro Prioridade
filtroPrioridade.addEventListener("change", atualizarLista);

// Filtro Ordenação
filtroOrdenacao.addEventListener("change", atualizarLista);

async function iniciarAplicacao() {
  if (!mensagemCarregando || !mensagemErro) {
    return;
  }

  mensagemCarregando.hidden = false;
  mensagemErro.hidden = true;

  try {
    const dados = await carregarChamadosAsync();
    chamadosAtuais = dados;
    atualizarLista();
  } catch (error) {
    console.log(error);
    mensagemErro.hidden = false;
  } finally {
    mensagemCarregando.hidden = true;
  }
}

iniciarAplicacao();
