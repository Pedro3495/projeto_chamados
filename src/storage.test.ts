import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  carregarChamados,
  carregarChamadosAsync,
  salvarChamados,
} from "./storage.js";

import type { Chamado } from "./data/chamados.js";


const chamadoValido: Chamado = {
  id: 1,
  titulo: "Erro na impressora",
  clienteNome: "Ana",
  dataAbertura: "2026-01-10",
  status: "Aberto",
  prioridade: "Alta",
};

beforeEach(() => {
  vi.stubGlobal("localStorage", {
    getItem: vi.fn(),
    setItem: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("salvarChamados", () => {
  it("salva a lista convertida para JSON", () => {
    salvarChamados([chamadoValido]);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "chamados",
      JSON.stringify([chamadoValido]),
    );
  });
});

describe("carregarChamados", () => {
  it("retorna a lista inicial quando não existem dados salvos", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);

    expect(carregarChamados()).toEqual([]);
  });

  it("carrega uma lista válida", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify([chamadoValido]),
    );

    expect(carregarChamados()).toEqual([chamadoValido]);
  });

  it("rejeita um chamado com status inválido", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify([{ ...chamadoValido, status: "Cancelado" }]),
    );

    expect(() => carregarChamados()).toThrow(
      "Dados de chamados inválidos no localStorage.",
    );
  });

  it("rejeita um chamado com prioridade inválida", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify([{ ...chamadoValido, prioridade: "Crítica" }]),
    );

    expect(() => carregarChamados()).toThrow(
      "Dados de chamados inválidos no localStorage.",
    );
  });

  it("rejeita um JSON malformado", () => {
    vi.mocked(localStorage.getItem).mockReturnValue("{json inválido");

    expect(() => carregarChamados()).toThrow();
  });
});

describe("carregarChamadosAsync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolve com chamados válidos", async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify([chamadoValido]),
    );

    const resultado = expect(carregarChamadosAsync()).resolves.toEqual([
      chamadoValido,
    ]);

    await vi.runAllTimersAsync();
    await resultado;
  });

  it("rejeita quando os dados são inválidos", async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(
      JSON.stringify([{ ...chamadoValido, status: "Cancelado" }]),
    );

    const resultado = expect(carregarChamadosAsync()).rejects.toThrow(
      "Dados de chamados inválidos no localStorage.",
    );

    await vi.runAllTimersAsync();
    await resultado;
  });
});
