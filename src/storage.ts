import { chamados, ehPrioridade, ehStatus } from "./data/chamados.js";
import type { Chamado } from "./data/chamados.js";

export function salvarChamados(listaDeChamados: Chamado[]) {
  const chamadosEmJSON = JSON.stringify(listaDeChamados);
  localStorage.setItem("chamados", chamadosEmJSON);
}

function ehChamado(valor: unknown): valor is Chamado {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  if (!("id" in valor) || typeof valor.id !== "number") {
    return false;
  }

  if (!("titulo" in valor) || typeof valor.titulo !== "string") {
    return false;
  }

  if (!("clienteNome" in valor) || typeof valor.clienteNome !== "string") {
    return false;
  }
  if (!("dataAbertura" in valor) || typeof valor.dataAbertura !== "string") {
    return false;
  }
  if (
    !("status" in valor) ||
    typeof valor.status !== "string" ||
    !ehStatus(valor.status)
  ) {
    return false;
  }

  if (
    !("prioridade" in valor) ||
    typeof valor.prioridade !== "string" ||
    !ehPrioridade(valor.prioridade)
  ) {
    return false;
  }
  return true;
}

export function carregarChamados(): Chamado[] {
  const chamadosSalvos = localStorage.getItem("chamados");

  if (chamadosSalvos) {
    const dados: unknown = JSON.parse(chamadosSalvos);
    if (Array.isArray(dados) && dados.every(ehChamado)) {
      return dados;
    } else {
      throw new Error("Dados de chamados inválidos no localStorage.");
    }
  }

  return [...chamados];
}

export function carregarChamadosAsync(): Promise<Chamado[]> {
  return new Promise<Chamado[]>((resolve, reject) => {
    setTimeout(() => {
      try {
        const dados = carregarChamados();
        resolve(dados);
      } catch (error) {
        reject(error);
      }
    }, 1000);
  });
}
