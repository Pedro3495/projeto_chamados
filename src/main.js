import { chamados } from "./data/chamados.js";
import { aplicarFiltros } from "./filtos.js";
import { salvarChamados, carregarChamadosAsync } from "./storage.js";
import {
  criarCardChamado,
  normalizarClasse,
  renderizarChamados,
} from "./ui.js";
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
const mensagemErro = document.querySelector("#msg-erro");
let idEmEdicao = null;

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

  salvarChamados(chamadosAtuais);
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
  salvarChamados(chamadosAtuais);
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
function atualizarLista() {
  const termo = busca.value.toLowerCase();

  const resultado = aplicarFiltros(
    chamadosAtuais,
    termo,
    filtroStatus.value,
    filtroPrioridade.value,
    filtroOrdenacao.value,
  );
  renderizarChamados(resultado);
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
