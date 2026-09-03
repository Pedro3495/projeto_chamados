import { chamados } from "./data/chamados.js";

export function salvarChamados(listaDeChamados) {
  const chamadosEmJSON = JSON.stringify(listaDeChamados);
  localStorage.setItem("chamados", chamadosEmJSON);
}

export function carregarChamados() {
  const chamadosSalvos = localStorage.getItem("chamados");

  if (chamadosSalvos) {
    return JSON.parse(chamadosSalvos);
  }
  return [...chamados];
}

export function carregarChamadosAsync() {
  return new Promise((resolve, reject) => {
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
