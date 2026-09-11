import { describe, expect, it } from "vitest";
import { aplicarFiltros } from "./filtros.js";
import type { Chamado } from "./data/chamados.js";

const chamados: Chamado[] = [
  {
    id: 1,
    titulo: "Erro na impressora",
    clienteNome: "Ana",
    dataAbertura: "2026-01-10",
    status: "Aberto",
    prioridade: "Baixa",
  },
  {
    id: 2,
    titulo: "Sistema indisponível",
    clienteNome: "Bruno",
    dataAbertura: "2026-03-20",
    status: "Em andamento",
    prioridade: "Urgente",
  },
  {
    id: 3,
    titulo: "Troca de senha",
    clienteNome: "Carla",
    dataAbertura: "2026-02-15",
    status: "Concluído",
    prioridade: "Alta",
  },
];

describe("aplicarFiltros", () => {
  it("ordena pelos chamados mais recentes", () => {
    const resultado = aplicarFiltros(chamados, "", "", "", "recentes");

    expect(resultado.map((chamado) => chamado.id)).toEqual([2, 3, 1]);
  });

  it("ordena pelos chamados mais antigos", () => {
    const resultado = aplicarFiltros(chamados, "", "", "", "antigos");

    expect(resultado.map((chamado) => chamado.id)).toEqual([1, 3, 2]);
  });

  it("ordena pela prioridade", () => {
    const resultado = aplicarFiltros(chamados, "", "", "", "prioridade");

    expect(resultado.map((chamado) => chamado.id)).toEqual([2, 3, 1]);
  });

  it("filtra pelo título", () => {
    const resultado = aplicarFiltros(chamados, "senha", "", "", "recentes");

    expect(resultado.map((chamado) => chamado.id)).toEqual([3]);
  });

  it("filtra pelo nome do cliente", () => {
    const resultado = aplicarFiltros(chamados, "bruno", "", "", "recentes");

    expect(resultado.map((chamado) => chamado.id)).toEqual([2]);
  });

  it("filtra pelo status", () => {
    const resultado = aplicarFiltros(chamados, "", "Concluído", "", "recentes");

    expect(resultado.map((chamado) => chamado.id)).toEqual([3]);
  });

  it("filtra pela prioridade", () => {
    const resultado = aplicarFiltros(chamados, "", "", "Baixa", "recentes");

    expect(resultado.map((chamado) => chamado.id)).toEqual([1]);
  });

  it("não altera a lista original", () => {
    aplicarFiltros(chamados, "", "", "", "recentes");

    expect(chamados.map((chamado) => chamado.id)).toEqual([1, 2, 3]);
  });
});
