import type { Chamado } from "./data/chamados.js";

export type DadosChamado = Omit<Chamado, "id" | "dataAbertura">;

export function obterProximoId(lista: Chamado[]): number {
  if (lista.length === 0) {
    return 1;
  }

  return Math.max(...lista.map((chamado) => chamado.id)) + 1;
}

export function criarChamado(
  lista: Chamado[],
  dados: DadosChamado,
  dataAbertura: string,
): Chamado[] {
  const novoChamado: Chamado = {
    ...dados,
    id: obterProximoId(lista),
    dataAbertura,
  };

  return [...lista, novoChamado];
}

export function atualizarChamado(
  lista: Chamado[],
  id: number,
  dados: DadosChamado,
): Chamado[] {
  return lista.map((chamado) => {
    if (chamado.id === id) {
      return {
        ...chamado,
        ...dados,
      };
    }
    return chamado;
  });
}

export function excluirChamado(lista: Chamado[], id: number): Chamado[] {
  return lista.filter((chamado) => chamado.id !== id);
}
