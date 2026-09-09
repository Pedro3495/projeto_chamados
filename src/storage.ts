import { chamados } from "./data/chamados.js";
import type { Chamado } from "./data/chamados.js";

export function salvarChamados(listaDeChamados: Chamado[]) {
  const chamadosEmJSON = JSON.stringify(listaDeChamados);
  localStorage.setItem("chamados", chamadosEmJSON);
}

export function carregarChamados(): Chamado[] {
  const chamadosSalvos = localStorage.getItem("chamados");

  if (chamadosSalvos) {
    return JSON.parse(chamadosSalvos);
  }
  return [...chamados];
}

export function carregarChamadosAsync(): Promise<Chamado[]>{
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
