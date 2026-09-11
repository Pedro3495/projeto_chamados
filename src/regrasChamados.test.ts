import { describe, expect, it } from "vitest";

import {
  atualizarChamado,
  criarChamado,
  excluirChamado,
  obterProximoId,
} from "./regrasChamados.js";

import type { Chamado } from "./data/chamados.js";
import type { DadosChamado } from "./regrasChamados.js";

const lista: Chamado[] = [
  {
    id: 1,
    titulo: "Erro na impressora",
    clienteNome: "Ana",
    dataAbertura: "2026-01-10",
    status: "Aberto",
    prioridade: "Alta",
  },
];

const dados: DadosChamado = {
  titulo: "Sistema indisponível",
  clienteNome: "Bruno",
  status: "Em andamento",
  prioridade: "Urgente",
};

describe("criarChamado", () => {
  it("cria um novo chamado", () => {
    const resultado = criarChamado(lista, dados, "2026-02-15");

    expect(resultado).toEqual([
      ...lista,
      {
        ...dados,
        id: 2,
        dataAbertura: "2026-02-15",
      },
    ]);
  });
});

describe("atualizarChamado", () => {
  it("atualiza um chamado existente", () => {
    const resultado = atualizarChamado(lista, 1, dados);

    expect(resultado).toEqual([
      {
        ...dados,
        id: 1,
        dataAbertura: "2026-01-10",
      },
    ]);
  });
  it("mantém a lista quando o id atualizado não existe", () => {
    const resultado = atualizarChamado(lista, 999, dados);

    expect(resultado).toEqual(lista);
  });
});
describe("excluirChamado", () => {
  it("exclui o chamado pelo id", () => {
    const resultado = excluirChamado(lista, 1);

    expect(resultado).toEqual([]);
  });

  it("mantém a lista quando o id não existe", () => {
    const resultado = excluirChamado(lista, 999);

    expect(resultado).toEqual(lista);
  });
});

describe("obterProximoId", () => {
  it("retorna 1 quando a lista está vazia", () => {
    expect(obterProximoId([])).toBe(1);
  });

  it("retorna o maior id mais 1", () => {
    const resultado = obterProximoId([
      { ...lista[0], id: 2 },
      { ...lista[0], id: 7 },
      { ...lista[0], id: 4 },
    ]);

    expect(resultado).toBe(8);
  });
});
